use aiken/hash.{Blake2b_224, Hash}
use aiken/collection/list
use aiken/transaction.{ScriptContext, Transaction}
use aiken/transaction/credential.{Address, VerificationKey}

type PaymentDatum {
  product_id: ByteArray,
  seller_address: Address,
  price: Int,
  deadline: Int,
  is_paid: Bool,
}

type Action {
  Pay
  Refund
  Cancel
}

type PaymentRedeemer {
  action: Action,
  buyer_address: Option<Address>,
  payment_amount: Option<Int>,
}

validator {
  fn payment(datum: PaymentDatum, redeemer: PaymentRedeemer, context: ScriptContext) -> Bool {
    let Transaction { inputs, outputs, valid_range, .. } = context.transaction
    
    when redeemer.action is {
      Pay -> {
        // For payment, ensure the buyer is the signer and payment amount matches price
        let signer_hash = transaction.find_first_signer(context)
        expect Some(signer) = signer_hash
        expect Some(buyer) = redeemer.buyer_address
        expect Some(amount) = redeemer.payment_amount
        
        // Check if the signer is the buyer, amount is correct, and deadline not passed
        credential.from_verification_key(signer) == buyer &&
        amount >= datum.price &&
        valid_range.upper_bound.bound_type.is_finite &&
        valid_range.upper_bound.bound_time < datum.deadline &&
        !datum.is_paid
      }
      
      Refund -> {
        // For refund, ensure the seller is the signer and payment was made
        let signer_hash = transaction.find_first_signer(context)
        expect Some(signer) = signer_hash
        expect Some(buyer) = redeemer.buyer_address
        
        // Check if the signer is the seller and payment was made
        credential.from_verification_key(signer) == datum.seller_address &&
        datum.is_paid
      }
      
      Cancel -> {
        // For cancellation, ensure the seller is the signer or deadline has passed
        let signer_hash = transaction.find_first_signer(context)
        expect Some(signer) = signer_hash
        
        // Check if the signer is the seller or deadline has passed
        credential.from_verification_key(signer) == datum.seller_address ||
        (valid_range.lower_bound.bound_type.is_finite &&
         valid_range.lower_bound.bound_time > datum.deadline)
      }
    }
  }
}
