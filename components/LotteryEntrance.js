import { useWeb3Contract } from "react-moralis";
import { contractAddress, abi } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const lotteryAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");
  console.log(chainId);
  console.log(lotteryAddress);

  const dispatch = useNotification();

  const {
    runContractFunction: enterLottery,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "enterLottery",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    const feefromCall = (await getEntranceFee()).toString();
    const numPlayersfromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerfromCall = await getRecentWinner();
    setEntranceFee(feefromCall);
    setNumPlayers(numPlayersfromCall);
    setRecentWinner(recentWinnerfromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };
  return (
    <div className="p-5">
      {lotteryAddress ? (
        <div>
          Hi From Lottery Entrance.
          <div>
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                onClick={async () => {
                  await enterLottery({
                    onSuccess: handleSuccess,
                    onError: (error) => console.log(error),
                  });
                }}
                disabled={isLoading || isFetching}
              >
                {isLoading || isFetching ? (
                  <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                ) : (
                  <div>Enter Lottery</div>
                )}
              </button>
            </div>
            <div>
              <div>
                Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")}
              </div>
              <div>NUMBER OF PLAYERS : {numPlayers}</div>
              <div>RECENT WINNER: {recentWinner}</div>
            </div>
          </div>
        </div>
      ) : (
        <div>No lotteryAddress Detected</div>
      )}
    </div>
  );
}
