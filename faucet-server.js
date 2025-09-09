import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ccc } from "@ckb-ccc/core";
import "dotenv/config";

const client = new ccc.ClientPublicTestnet({url: "https://testnet.ckb.dev/"});
const signer = new ccc.SignerCkbPrivateKey(client, process.env.FAUCET_PRIVKEY || "");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// derived faucet address
const FAUCET_ADDRESS = await signer.getRecommendedAddress();
const FAUCET_ADDRESS_OBJ = (await signer.getAddressObjs())[0];
const FAUCET_BALANCE = await client.getBalance([FAUCET_ADDRESS_OBJ.script]);

// claim endpoint
app.post("/faucet", async (req, res) => {
  try {
    const { address, amount } = req.body;
    if (!address) return res.status(400).json({ error: "Missing address" });

    const tx = ccc.Transaction.from({
      outputs: [{
        lock: (await ccc.Address.fromString(address, client)).script,
        capacity: ccc.fixedPointFrom(amount) }],
    });

    await tx.completeInputsByCapacity(signer);
    await tx.completeFeeBy(signer, 1500);
    const txHash = await signer.sendTransaction(tx);

    return res.status(200).json({ success: true, txHash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Faucet server running on http://localhost:${PORT}`);
  console.log(`Faucet address: ${FAUCET_ADDRESS}`);
  console.log(`Faucet balance: ${FAUCET_BALANCE} CKB`);
});

