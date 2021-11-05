import React, { useState } from "react";

import styles from "../styles/Home.module.css";
import Tokens from "../constants/Tokens";
import getOutgoingAmtWithAmplification from "../utils/getOutgoingAmtWithAmplification";

interface DMMDemonstrationProps {}

const DMMDemonstration: React.FunctionComponent = (
  props: DMMDemonstrationProps
) => {
  const [apples, setApples] = useState<number>(5000);
  const [bananas, setBananas] = useState<number>(5000);
  const [amplification, setAmplification] = useState<string>("1");

  const [swapOrder, setSwapOrder] = useState<Tokens[]>([
    Tokens.Apple,
    Tokens.Banana,
  ]);

  const [incomingAmt, setIncomingAmt] = useState<string>("0");
  const [outgoingAmt, setOutgoingAmt] = useState<number>(0);

  const handleChangeAmplification = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Using parseFloat here will prevent setting of decimal places
    const nextAmplification = event.target.value;
    setAmplification(nextAmplification);

    // calcNextOutgoingAmt(incomingAmt);
  };

  const calcNextOutgoingAmt = (incomingAmt: string) => {
    const incomingTokenAmt = swapOrder[0] === Tokens.Apple ? apples : bananas;

    const outgoingTokenAmt = swapOrder[1] === Tokens.Banana ? bananas : apples;

    const outgoingAmt = getOutgoingAmtWithAmplification({
      incomingTokenAmt,
      outgoingTokenAmt,
      incomingAmt,
      amplification,
    });

    setOutgoingAmt(outgoingAmt);
  };

  const handleChangeIncomingAmt = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Using parseFloat here will prevent setting of decimal places
    const incomingAmt = event.target.value;
    setIncomingAmt(incomingAmt);

    calcNextOutgoingAmt(incomingAmt);
  };

  const switchOrder = () => {
    const nextSwapOrder = [...swapOrder];
    const reversedSwapOrder = nextSwapOrder.reverse();

    const incomingTokenAmt =
      reversedSwapOrder[0] === Tokens.Apple ? apples : bananas;

    const outgoingTokenAmt =
      reversedSwapOrder[1] === Tokens.Banana ? bananas : apples;

    const outgoingAmt = getOutgoingAmtWithAmplification({
      incomingTokenAmt,
      outgoingTokenAmt,
      incomingAmt,
      amplification,
    });

    setOutgoingAmt(outgoingAmt);

    setSwapOrder(reversedSwapOrder);
  };

  const confirmSwap = () => {
    const k = apples * bananas;
    let nextApples: number = 0;
    let nextBananas: number = 0;
    const nextIncomingAmt = parseFloat(incomingAmt);

    if (swapOrder[0] === Tokens.Apple) {
      nextApples = apples + nextIncomingAmt;
      nextBananas = k / nextApples;
    } else {
      nextBananas = bananas + nextIncomingAmt;
      nextApples = k / nextBananas;
    }

    setApples(nextApples);
    setBananas(nextBananas);
    setIncomingAmt("0");
    setOutgoingAmt(0);
  };

  const nextAmplification: number = parseFloat(amplification);
  const nextConstant: string = Math.round(
    apples * nextAmplification * bananas * nextAmplification
  ).toLocaleString();
  const amplifiedApples: number = apples * nextAmplification;
  const amplifiedBananas: number = bananas * nextAmplification;
  const amplifiedAppleStr: string = amplifiedApples.toLocaleString();
  const amplifiedBananaStr: string = amplifiedBananas.toLocaleString();

  const incomingToken: string = swapOrder[0];
  const outgoingToken: string = swapOrder[1];

  const outgoingTokenAmount: number =
    outgoingToken === Tokens.Apple ? apples : bananas;
  const amplifiedOutgoingTokenAmt: number =
    outgoingTokenAmount * nextAmplification;

  const nextIncomingAmt: number = parseFloat(incomingAmt);
  const nextIncomingTokenAmount: number =
    incomingToken === Tokens.Apple
      ? nextIncomingAmt + amplifiedApples
      : nextIncomingAmt + amplifiedBananas;
  const nextOutgoingTokenAmount: string = (
    (amplifiedApples * amplifiedBananas) /
    nextIncomingTokenAmount
  ).toFixed(2);

  return (
    <div>
      <p className={styles.explanation}>
        {`A pool will start with a equal number of both tokens
        In this instance, we can start with 5000 Apples and 5000 Bananas`}
      </p>
      <p>
        Amplification:{" "}
        <input
          value={amplification}
          onChange={handleChangeAmplification}
          type="number"
          step="any"
        />
      </p>
      <p className={styles.explanation}>
        {`Taking Apples as x, and Bananas as y,
        you can set amplification above accordingly.
        
        The amplified amount of Apples is: ${amplifiedAppleStr}
        (${apples} Apples * ${amplification} amplification = ${amplifiedAppleStr})

        The amplified amount of Bananas is: ${amplifiedBananaStr}
        (${bananas} Bananas * ${amplification} amplification = ${amplifiedBananaStr})

        ${amplifiedAppleStr} (Apples) * ${amplifiedBananaStr} (Bananas) = ${nextConstant} (k)
        The amplified constant is ${nextConstant}`}
      </p>
      <div>
        <h3>APPLE-BANANA Liquidity Pool</h3>
        <p>
          There are currently {apples} Apples and {bananas} Bananas in the pool.
        </p>
        <h4>Swap</h4>
        <button onClick={switchOrder}>Switch</button>
        <p>From:</p>
        <input
          value={incomingAmt}
          onChange={handleChangeIncomingAmt}
          type="number"
          step="any"
        />{" "}
        {incomingToken}s<p>To:</p>
        <input value={outgoingAmt} type="number" step="any" disabled />{" "}
        {outgoingToken}s
        {nextIncomingAmt > 0 && (
          <>
            <p className={styles.explanation}>
              {`If you put in ${incomingAmt} ${incomingToken}s,
              this will increase the virtual balance of ${incomingToken}s to ${nextIncomingTokenAmount}.`}
            </p>
            <p className={styles.explanation}>
              {`k must always be ${nextConstant}.
              We have to divide ${nextConstant} by the new number of ${nextIncomingTokenAmount} ${incomingToken}s.
              From there, you get ${nextConstant} /  ${nextIncomingTokenAmount} ≈ ${nextOutgoingTokenAmount},
              which is the desired amount of ${outgoingToken}s to maintain constant k.`}
            </p>
            <p className={styles.explanation}>
              {`The current virtual balance of ${outgoingToken}s is ${amplifiedOutgoingTokenAmt}.
              To maintain the current constant of k, 
              the number of ${outgoingToken}s has to decrease to ${nextOutgoingTokenAmount}.
              Therefore, you will receive ~${outgoingAmt.toFixed(
                2
              )} (${amplifiedOutgoingTokenAmt} - ${nextOutgoingTokenAmount}).`}
            </p>

            <p className={styles.code}>
              {`Therefore, you will get ~${(
                outgoingAmt / nextIncomingAmt
              ).toFixed(2)} ${outgoingToken} for 1 ${incomingToken}.
              If you expect 1 ${outgoingToken} for 1 ${incomingToken}, there is a price impact of about ${(
                -(1 - outgoingAmt / nextIncomingAmt) * 100
              ).toFixed(2)}%.
              `}
            </p>
            <button onClick={confirmSwap}>Confirm Swap</button>
          </>
        )}
      </div>
    </div>
  );
};

export default DMMDemonstration;
