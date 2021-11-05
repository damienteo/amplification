interface getOutgoingAmtProps {
  incomingTokenAmt: number;
  outgoingTokenAmt: number;
  incomingAmt: string;
}

const getOutgoingAmt = (props: getOutgoingAmtProps): number => {
  const { incomingTokenAmt, outgoingTokenAmt, incomingAmt } = props;

  const k = incomingTokenAmt * outgoingTokenAmt;
  const nextIncomingAmt = parseFloat(incomingAmt);

  const nextIncomingTokenAmt = incomingTokenAmt + nextIncomingAmt;
  const nextOutgoingTokenAmt = k / nextIncomingTokenAmt;

  const outgoingAmt = outgoingTokenAmt - nextOutgoingTokenAmt;

  return outgoingAmt;
};

export default getOutgoingAmt;
