const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";

  if(!event){
    return TRIVIAL_PARTITION_KEY
  }

  let candidate = getCandidateFromEvent(event);

  return getValidatedCandidate(candidate);

};


function getCandidateFromEvent(event){
    let candidate;
    if (event.partitionKey) {
      candidate = event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      candidate = getMessageHash(data);
    }
    return candidate;
}

function getValidatedCandidate(candidate){
  const MAX_PARTITION_KEY_LENGTH = 256;
  let validatedCandidate=candidate;
  if (typeof validatedCandidate !== "string") {
    validatedCandidate = JSON.stringify(validatedCandidate);
  }

  if (validatedCandidate.length > MAX_PARTITION_KEY_LENGTH) {
    validatedCandidate = getMessageHash(validatedCandidate);
  }
  return validatedCandidate;
}

function getMessageHash(message){
  return crypto.createHash("sha3-512").update(message).digest("hex");
} 