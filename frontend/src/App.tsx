import { useMemo, useState } from "react";
import * as CoffeeLoyalty from "coffee_loyalty";
import "./App.css";
import {
  ADMIN_ADDRESS,
  CONTRACT_ID,
  RPC_URL,
  VND_PER_POINT,
} from "./contractConfig";

type StudentStats = {
  balance: number;
  totalEarned: number;
  purchases: number;
  level: number;
};

function shortAddress(address: string) {
  if (!address) return "Not set";
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

function readResultValue(response: any) {
  if (response && typeof response.result !== "undefined") {
    return Number(response.result);
  }

  return 0;
}

export default function App() {
  const [studentAddress, setStudentAddress] = useState("");
  const [amountVnd, setAmountVnd] = useState(100000);
  const [redeemPoints, setRedeemPoints] = useState(30);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [status, setStatus] = useState("Paste student wallet address to start.");
  const [loading, setLoading] = useState(false);

  const contract = useMemo(() => {
    return new CoffeeLoyalty.Client({
      ...CoffeeLoyalty.networks.testnet,
      rpcUrl: RPC_URL,
    });
  }, []);

  const cleanStudentAddress = studentAddress.trim();
  const estimatedPoints = Math.floor(Number(amountVnd || 0) / VND_PER_POINT);

  const earnCommand = `stellar contract invoke --id ${CONTRACT_ID} --source-account cafe_admin --network testnet -- earn --admin ${ADMIN_ADDRESS} --student ${
    cleanStudentAddress || "STUDENT_ADDRESS"
  } --amount_vnd ${amountVnd}`;

  const level3Command = `stellar contract invoke --id ${CONTRACT_ID} --source-account cafe_admin --network testnet -- earn --admin ${ADMIN_ADDRESS} --student ${
    cleanStudentAddress || "STUDENT_ADDRESS"
  } --amount_vnd 1500000`;

  const redeemCommand = `stellar contract invoke --id ${CONTRACT_ID} --source-account student1 --network testnet -- redeem --student ${
    cleanStudentAddress || "STUDENT_ADDRESS"
  } --points ${redeemPoints}`;

  async function refreshStudent() {
    if (!cleanStudentAddress.startsWith("G")) {
      setStatus("Student address must start with G...");
      return;
    }

    setLoading(true);
    setStatus("Reading on-chain data from Stellar Testnet...");

    try {
      const balanceRes = await contract.balance({
        student: cleanStudentAddress,
      });

      const totalRes = await contract.total_earned({
        student: cleanStudentAddress,
      });

      const purchaseRes = await contract.purchase_count({
        student: cleanStudentAddress,
      });

      const levelRes = await contract.level({
        student: cleanStudentAddress,
      });

      console.log("balanceRes:", balanceRes);
      console.log("totalRes:", totalRes);
      console.log("purchaseRes:", purchaseRes);
      console.log("levelRes:", levelRes);

      setStats({
        balance: readResultValue(balanceRes),
        totalEarned: readResultValue(totalRes),
        purchases: readResultValue(purchaseRes),
        level: readResultValue(levelRes),
      });

      setStatus("On-chain data loaded successfully.");
    } catch (error) {
      console.error("Read contract error:", error);
      setStatus("Failed to read contract data. Please open F12 > Console and send the red error.");
    } finally {
      setLoading(false);
    }
  }

  async function copyCommand(command: string, label: string) {
    try {
      await navigator.clipboard.writeText(command);
      setStatus(`${label} command copied. Paste it in VS Code terminal.`);
    } catch {
      setStatus("Copy failed. Please copy the command manually.");
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Stellar Testnet Mini dApp</p>
        <h1>Campus Coffee Loyalty</h1>
        <p className="subtitle">
          Students earn loyalty points after buying coffee or milk tea on campus.
          Points are stored on a Stellar smart contract and can be redeemed for
          rewards.
        </p>

        <div className="contractBox">
          <div>
            <span>Contract</span>
            <strong>{shortAddress(CONTRACT_ID)}</strong>
          </div>
          <div>
            <span>Network</span>
            <strong>Stellar Testnet</strong>
          </div>
          <div>
            <span>Cafe Admin</span>
            <strong>{shortAddress(ADMIN_ADDRESS)}</strong>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <h2>Student Dashboard</h2>
          <p className="muted">
            Paste a student wallet address to read loyalty data directly from
            the deployed Stellar smart contract.
          </p>

          <label>Student wallet address</label>
          <input
            value={studentAddress}
            onChange={(event) => setStudentAddress(event.target.value)}
            placeholder="G..."
          />

          <button onClick={refreshStudent} disabled={loading}>
            {loading ? "Loading..." : "Refresh On-chain Data"}
          </button>

          <div className="stats">
            <div>
              <span>Balance</span>
              <strong>{stats ? stats.balance : "--"}</strong>
            </div>
            <div>
              <span>Total Earned</span>
              <strong>{stats ? stats.totalEarned : "--"}</strong>
            </div>
            <div>
              <span>Purchases</span>
              <strong>{stats ? stats.purchases : "--"}</strong>
            </div>
            <div>
              <span>Level</span>
              <strong>{stats ? stats.level : "--"}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Cafe Admin Flow</h2>
          <p className="muted">
            The cafe admin grants points after a student buys coffee or milk tea.
            For this demo, admin transactions are executed through Stellar CLI.
          </p>

          <label>Purchase amount VND</label>
          <input
            type="number"
            value={amountVnd}
            onChange={(event) => setAmountVnd(Number(event.target.value))}
          />

          <div className="preview">
            Estimated points: <strong>{estimatedPoints}</strong>
          </div>

          <button onClick={() => copyCommand(earnCommand, "Earn points")}>
            Copy Earn Points Command
          </button>

          <button onClick={() => copyCommand(level3Command, "Level 3 demo")}>
            Copy Level 3 Demo Command
          </button>

          <label>Redeem points</label>
          <input
            type="number"
            value={redeemPoints}
            onChange={(event) => setRedeemPoints(Number(event.target.value))}
          />

          <button onClick={() => copyCommand(redeemCommand, "Redeem")}>
            Copy Redeem Command
          </button>
        </div>
      </section>

      <section className="card wide">
        <h2>Reward Rules</h2>

        <div className="rules">
          <div>
            <span>10,000 VND</span>
            <strong>1 Point</strong>
          </div>
          <div>
            <span>Level 2</span>
            <strong>50 Points</strong>
          </div>
          <div>
            <span>Level 3</span>
            <strong>150 Points</strong>
          </div>
          <div>
            <span>Redeem</span>
            <strong>30 Points</strong>
          </div>
        </div>
      </section>

      <section className="card wide">
        <h2>Demo Script</h2>
        <ol>
          <li>Student buys coffee or milk tea on campus.</li>
          <li>Cafe admin grants loyalty points on Stellar Testnet.</li>
          <li>Student checks balance, total points, purchase count, and level.</li>
          <li>Student redeems points for a free drink reward.</li>
        </ol>

        <div className="status">{status}</div>
      </section>
    </main>
  );
}