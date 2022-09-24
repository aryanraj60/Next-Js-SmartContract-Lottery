import { useMoralis } from "react-moralis";
import {useEffect} from "react";

export default function ManualHeader() {

  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis();
  console.log(isWeb3Enabled)

  useEffect(() => {
    if (isWeb3Enabled) return
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3()
      }
    }
  }, [isWeb3Enabled])
  
  //no dependency array: run anytime something re-renders
  //Carefull with this! Because you can get circular renders
  //blank dependency array, run once it loads
  //dependencies in the array, run everytime something in there changes.
  
  useEffect(() => {
      Moralis.onAccountChanged((account) => {
        console.log(`Account changed to ${account}`)
        if (account == null) {
          window.localStorage.removeItem("connected")
          deactivateWeb3()
          console.log("Null account found")
        }
      })
  }, [])
  

  // useEffect(() => {
  //   Moralis.onAccountChanged((account) => {
  //     console.log(`Accounts changed to: ${account}`)
  //     if (account == null) {
  //       window.localStorage.removeItem("connected")
  //       deactivateWeb3()
  //       console.log("Null account found")
  //     }
  //   })
  // }, [])

  return (
    <div>
    {account ? (<div>Connected to {account}</div>) : (<button onClick={async() => {
      await enableWeb3()
      if(typeof window !== "undefined") {
        window.localStorage.setItem("connected", "injected")
      }
      }} disabled={isWeb3EnableLoading}>Connect</button>)} 
    </div>
  );
}
