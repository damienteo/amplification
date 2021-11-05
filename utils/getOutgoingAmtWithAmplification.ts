interface getOutgoingAmtWithAmplificationProps {
  incomingTokenAmt: number;
  outgoingTokenAmt: number;
  incomingAmt: string;
  amplification: string;
}

const getOutgoingAmtWithAmplification = (
  props: getOutgoingAmtWithAmplificationProps
): number => {
  const { incomingTokenAmt, outgoingTokenAmt, incomingAmt, amplification } =
    props;

  const nextIncomingAmt = parseFloat(incomingAmt);
  const nextAmplification = parseFloat(amplification);

  const k =
    incomingTokenAmt * nextAmplification * outgoingTokenAmt * nextAmplification;

  const incomingTokenAmplifiedAmt = incomingTokenAmt * nextAmplification;
  const nextIncomingTokenAmplifiedAmt =
    incomingTokenAmplifiedAmt + nextIncomingAmt;

  const nextOutgoingTokenAmplifiedAmt = k / nextIncomingTokenAmplifiedAmt;

  const outgoingTokenAmplifiedAmt = outgoingTokenAmt * nextAmplification;
  const outgoingAmt = outgoingTokenAmplifiedAmt - nextOutgoingTokenAmplifiedAmt;

  return outgoingAmt;
};

export default getOutgoingAmtWithAmplification;
