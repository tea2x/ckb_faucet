1. create a .env file with the following content
```
FAUCET_PRIVKEY=<ckb_private_key_that_hold_ckbs_for_the_faucet>
PORT=<net port>
```

2. run `node faucet-server.js`

3. If local faucet is not enough, you may use ngrok to expose the faucet endpoint:
    - Visit https://ngrok.com/ to sign up and install your authtoken.
    - Run `npx ngrok http 4000`