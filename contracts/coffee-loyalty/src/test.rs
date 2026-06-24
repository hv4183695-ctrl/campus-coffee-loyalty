#![cfg(test)]

extern crate std;

use super::*;
use soroban_sdk::{Address, Env};
use soroban_sdk::testutils::Address as _;

fn setup() -> (Env, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(CoffeeLoyalty, ());
    let admin = Address::generate(&env);
    let student = Address::generate(&env);

    (env, contract_id, admin, student)
}

#[test]
fn init_contract_and_student_starts_empty() {
    let (env, contract_id, admin, student) = setup();
    let client = CoffeeLoyaltyClient::new(&env, &contract_id);

    client.init(&admin);

    assert_eq!(client.balance(&student), 0);
    assert_eq!(client.total_earned(&student), 0);
    assert_eq!(client.purchase_count(&student), 0);
    assert_eq!(client.level(&student), 1);
}

#[test]
fn student_earns_points_after_buying_coffee() {
    let (env, contract_id, admin, student) = setup();
    let client = CoffeeLoyaltyClient::new(&env, &contract_id);

    client.init(&admin);

    let earned_points = client.earn(&admin, &student, &100_000);

    assert_eq!(earned_points, 10);
    assert_eq!(client.balance(&student), 10);
    assert_eq!(client.total_earned(&student), 10);
    assert_eq!(client.purchase_count(&student), 1);
}

#[test]
fn student_can_redeem_points() {
    let (env, contract_id, admin, student) = setup();
    let client = CoffeeLoyaltyClient::new(&env, &contract_id);

    client.init(&admin);

    client.earn(&admin, &student, &500_000);

    let remaining_balance = client.redeem(&student, &30);

    assert_eq!(remaining_balance, 20);
    assert_eq!(client.balance(&student), 20);
}

#[test]
fn student_reaches_level_3() {
    let (env, contract_id, admin, student) = setup();
    let client = CoffeeLoyaltyClient::new(&env, &contract_id);

    client.init(&admin);

    client.earn(&admin, &student, &1_500_000);

    assert_eq!(client.total_earned(&student), 150);
    assert_eq!(client.level(&student), 3);
}

#[test]
fn spend_too_small_should_fail() {
    let (env, contract_id, admin, student) = setup();
    let client = CoffeeLoyaltyClient::new(&env, &contract_id);

    client.init(&admin);

    let result = client.try_earn(&admin, &student, &9_000);

    assert!(result.is_err());
}