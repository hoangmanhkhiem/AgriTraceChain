use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{ScriptContext, Transaction}
use aiken/transaction/credential.{Address, VerificationKey}

type ProductDatum {
  product_id: ByteArray,
  farmer_address: Address,
  product_name: ByteArray,
  product_type: ByteArray,
  quantity: Int,
  unit: ByteArray,
  location: ByteArray,
  harvest_date: Int,
  certifications: List<ByteArray>,
  registration_date: Int,
}

type Action {
  Register
  Update
  Transfer
  Verify
}

type ProductRedeemer {
  action: Action,
  new_owner: Option<Address>,
  update_fields: Option<ProductDatum>,
  verifier: Option<Address>,
}

validator {
  fn product_registration(datum: ProductDatum, redeemer: ProductRedeemer, context: ScriptContext) -> Bool {
    let Transaction { inputs, outputs, .. } = context.transaction
    
    when redeemer.action is {
      Register -> {
        // For registration, we just need to ensure the farmer is the signer
        let signer_hash = transaction.find_first_signer(context)
        expect Some(signer) = signer_hash
        
        // Check if the signer is the farmer
        credential.from_verification_key(signer) == datum.farmer_address
      }
      
      Update -> {
        // For update, ensure the farmer is the signer and update fields are provided
        let signer_hash = transaction.find_first_signer(context)
        expect Some(signer) = signer_hash
        expect Some(update_fields) = redeemer.update_fields
        
        // Check if the signer is the farmer
        credential.from_verification_key(signer) == datum.farmer_address
      }
      
      Transfer -> {
        // For transfer, ensure the farmer is the signer and new owner is provided
        let signer_hash = transaction.find_first_signer(context)
        expect Some(signer) = signer_hash
        expect Some(new_owner) = redeemer.new_owner
        
        // Check if the signer is the farmer
        credential.from_verification_key(signer) == datum.farmer_address
      }
      
      Verify -> {
        // For verification, ensure the verifier is the signer
        let signer_hash = transaction.find_first_signer(context)
        expect Some(signer) = signer_hash
        expect Some(verifier) = redeemer.verifier
        
        // Check if the signer is the verifier
        credential.from_verification_key(signer) == verifier
      }
    }
  }
}
