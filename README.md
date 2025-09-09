1. create a .env file with the following content
```
FAUCET_PRIVKEY=<ckb_private_key_that_hold_ckbs_for_the_faucet>
PORT=<net port>
```

2. run `node faucet-server.js`

3. If local faucet is not enough, you may use ngrok to expose the faucet endpoint:
    - Visit https://ngrok.com/ to sign up and install your authtoken.
    - Run `npx ngrok http 4000`
4. On the frontend side, here's an example how to request from the faucet using `ngrok-provided-link/faucet`:
```javascript
  const requestFaucet = async () => {
    if (!activeAccount?.address) {
      message.error("No active account address found");
      return;
    }

    try {
      const resp = await fetch("https://7f77f1e63489.ngrok-free.app/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: activeAccount.address, amount: 10_000 }),
      });

      const data = await resp.json();

      if (resp.ok) {
        message.success(`Faucet request sent! Tx hash: ${data.txHash}`);
      } else {
        message.error(`Faucet error: ${data.error}`);
      }
    } catch (err: any) {
      message.error(`Request failed: ${err.message}`);
    }
  };
```
