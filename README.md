# Campus Coffee Loyalty

## Problem

Campus coffee shops often manage student loyalty points manually with paper cards or spreadsheets, making points easy to lose, edit, or miscount.

## Solution

Campus Coffee Loyalty is a Stellar Testnet mini dApp where a cafe admin can grant on-chain loyalty points to students after they buy coffee or milk tea, and students can check their balance, purchase count, and loyalty level.

## Why Stellar

Stellar Soroban enables fast, low-cost, and transparent smart contract interactions, making it suitable for small campus reward transactions and verifiable loyalty records.

## Target User

This project is for campus coffee shops, student clubs, and students who want a simple and transparent loyalty point system.

## Live Demo

* Network: Stellar Testnet

* **Contract ID**: `CBOOI6YDXYCVZZPAMIRAV3DHLGZH6F4G5M6OKG5UYPUCGJLKJED5KXIE`

* **Deploy Transaction**: https://stellar.expert/explorer/testnet/tx/a3a45cbf70b82b55ec0cc28280eab767cd13e0f30bf3554d0615a756fc67d580

* **Init Transaction**: https://stellar.expert/explorer/testnet/tx/d629745a6c16c1bfc97ba93bb0160d7608a8eb9595413ba55b7d472336df3f94

## Features

* Cafe admin initializes the contract
* Cafe admin grants loyalty points to students
* Students can check their current point balance
* Students can check total earned points
* Students can check purchase count
* Students can check loyalty level
* Students can redeem points
* Contract emits events for init, earn, and redeem actions
* Frontend reads on-chain data from Stellar Testnet

## Reward Rules

| Rule             | Value           |
| ---------------- | --------------- |
| 10,000 VND spent | 1 point         |
| Level 1          | Under 50 points |
| Level 2          | 50+ points      |
| Level 3          | 150+ points     |
| Redeem reward    | 30 points       |

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/hv4183695-ctrl/campus-coffee-loyalty.git
cd campus-coffee-loyalty
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### 3. Run smart contract tests

```bash
cargo test
```

Expected result:

```txt
test result: ok. 5 passed
```

### 4. Build the smart contract

```bash
stellar contract build
```

The compiled Wasm file should be generated at:

```txt
target/wasm32v1-none/release/coffee_loyalty.wasm
```

### 5. Deploy the smart contract

```bash
stellar contract deploy --wasm target/wasm32v1-none/release/coffee_loyalty.wasm --source-account cafe_admin --network testnet --alias coffee_loyalty
```

### 6. Initialize the contract

```bash
stellar contract invoke --id CBOOI6YDXYCVZZPAMIRAV3DHLGZH6F4G5M6OKG5UYPUCGJLKJED5KXIE --source-account cafe_admin --network testnet -- init --admin GAC5KQHDYYNF5G43NAHPUOZFVCV7JIZZUR7GC73W5JZTAXGD4MQNHCEIZL
```

### 7. Grant loyalty points

```bash
$student = stellar keys address student1
$admin = stellar keys address cafe_admin

stellar contract invoke --id CBOOI6YDXYCVZZPAMIRAV3DHLGZH6F4G5M6OKG5UYPUCGJLKJED5KXIE --source-account cafe_admin --network testnet -- earn --admin $admin --student $student --amount_vnd 100000
```

Expected result:

```txt
10
```

This means the student spent 100,000 VND and earned 10 loyalty points.

### 8. Check student balance

```bash
stellar contract invoke --id CBOOI6YDXYCVZZPAMIRAV3DHLGZH6F4G5M6OKG5UYPUCGJLKJED5KXIE --source-account student1 --network testnet -- balance --student $student
```

### 9. Check student level

```bash
stellar contract invoke --id CBOOI6YDXYCVZZPAMIRAV3DHLGZH6F4G5M6OKG5UYPUCGJLKJED5KXIE --source-account student1 --network testnet -- level --student $student
```

### 10. Run the frontend

```bash
cd frontend
npm run dev
```

Open:

```txt
http://localhost:5173/
```

### 11. Build frontend for production

```bash
cd frontend
npm run build
```

## Frontend Demo Flow

1. Open the Campus Coffee Loyalty frontend.
2. Paste the student wallet address.
3. Click **Refresh On-chain Data**.
4. The app reads student balance, total earned points, purchase count, and level from Stellar Testnet.
5. Run the earn command in Stellar CLI.
6. Refresh the frontend again.
7. The frontend updates the student’s on-chain loyalty data.
8. After the student reaches 150+ total earned points, the frontend shows **Level 3**.


## Tech Stack

* Smart Contract: Rust / Soroban SDK
* Blockchain: Stellar Testnet
* Contract Tooling: Stellar CLI
* Frontend: React / TypeScript / Vite
* Contract Integration: Generated TypeScript bindings
* Wallet / Accounts: Stellar CLI testnet identities
* Network: Stellar Testnet

## Evidence

The project includes evidence for Level 3 submission:

* Smart contract tests passed
* Contract build success
* Contract deployed on Stellar Testnet
* Init transaction success
* Earn points transaction success
* Frontend mini dApp running locally
* Frontend reads on-chain data successfully
* Student reaches Level 3 on-chain
* Frontend production build success

## Level 3 Requirements

| Requirement                | Status                                           |
| -------------------------- | ------------------------------------------------ |
| Complete mini dApp         | Done                                             |
| Tests                      | Done, 5 tests passed                             |
| Production basic           | Done with frontend production build              |
| Advanced contract          | Done with admin, earn, redeem, level, and events |
| Stellar Testnet deployment | Done                                             |
| On-chain frontend read     | Done                                             |

## Team
 [hv4183695@gmail.com]
