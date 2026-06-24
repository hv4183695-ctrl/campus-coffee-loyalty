#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, symbol_short, Address,
    Env,
};

const VND_PER_POINT: u32 = 10_000;
const LEVEL_2_POINTS: u32 = 50;
const LEVEL_3_POINTS: u32 = 150;

#[contract]
pub struct CoffeeLoyalty;

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Balance(Address),
    TotalEarned(Address),
    PurchaseCount(Address),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum CoffeeError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    SpendTooSmall = 4,
    InvalidPoints = 5,
    InsufficientPoints = 6,
}

#[contractimpl]
impl CoffeeLoyalty {
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, CoffeeError::AlreadyInitialized);
        }

        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);

        env.events()
            .publish((symbol_short!("init"), admin.clone()), true);
    }

    pub fn earn(env: Env, admin: Address, student: Address, amount_vnd: u32) -> u32 {
        admin.require_auth();
        check_admin(&env, &admin);

        if amount_vnd < VND_PER_POINT {
            panic_with_error!(&env, CoffeeError::SpendTooSmall);
        }

        let points = amount_vnd / VND_PER_POINT;

        if points == 0 {
            panic_with_error!(&env, CoffeeError::InvalidPoints);
        }

        let old_balance = read_u32(&env, DataKey::Balance(student.clone()));
        let old_total = read_u32(&env, DataKey::TotalEarned(student.clone()));
        let old_count = read_u32(&env, DataKey::PurchaseCount(student.clone()));

        let new_balance = old_balance + points;
        let new_total = old_total + points;
        let new_count = old_count + 1;

        write_u32(&env, DataKey::Balance(student.clone()), new_balance);
        write_u32(&env, DataKey::TotalEarned(student.clone()), new_total);
        write_u32(&env, DataKey::PurchaseCount(student.clone()), new_count);

        env.events()
            .publish((symbol_short!("earn"), student.clone()), points);

        points
    }

    pub fn redeem(env: Env, student: Address, points: u32) -> u32 {
        student.require_auth();

        if points == 0 {
            panic_with_error!(&env, CoffeeError::InvalidPoints);
        }

        let balance = read_u32(&env, DataKey::Balance(student.clone()));

        if balance < points {
            panic_with_error!(&env, CoffeeError::InsufficientPoints);
        }

        let new_balance = balance - points;

        write_u32(&env, DataKey::Balance(student.clone()), new_balance);

        env.events()
            .publish((symbol_short!("redeem"), student.clone()), points);

        new_balance
    }

    pub fn balance(env: Env, student: Address) -> u32 {
        read_u32(&env, DataKey::Balance(student))
    }

    pub fn total_earned(env: Env, student: Address) -> u32 {
        read_u32(&env, DataKey::TotalEarned(student))
    }

    pub fn purchase_count(env: Env, student: Address) -> u32 {
        read_u32(&env, DataKey::PurchaseCount(student))
    }

    pub fn level(env: Env, student: Address) -> u32 {
        let total = read_u32(&env, DataKey::TotalEarned(student));

        if total >= LEVEL_3_POINTS {
            3
        } else if total >= LEVEL_2_POINTS {
            2
        } else {
            1
        }
    }

    pub fn points_for_amount(_env: Env, amount_vnd: u32) -> u32 {
        amount_vnd / VND_PER_POINT
    }
}

fn check_admin(env: &Env, admin: &Address) {
    let stored_admin: Address = env
        .storage()
        .instance()
        .get(&DataKey::Admin)
        .unwrap_or_else(|| panic_with_error!(env, CoffeeError::NotInitialized));

    if stored_admin != admin.clone() {
        panic_with_error!(env, CoffeeError::Unauthorized);
    }
}

fn read_u32(env: &Env, key: DataKey) -> u32 {
    env.storage().persistent().get(&key).unwrap_or(0)
}

fn write_u32(env: &Env, key: DataKey, value: u32) {
    env.storage().persistent().set(&key, &value);
}

mod test;