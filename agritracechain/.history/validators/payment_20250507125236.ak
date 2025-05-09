use cardano/address.{Address}
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{Transaction, OutputReference}
use vodka_extra_signatories.{key_signed}
use vodka_validity_range.{valid_after}
pub type PaymentDatum{
  buyer: VerificationKeyHash,
  shopper: VerificationKeyHash,
  product_id: ByteArray,
  product_name: ByteArray,
  timeExpire: Int,
  is_paid: Int,
}
pub type Redeemer{
  action: ByteArray,
  
}
validator payment(){
    spend(datum_otp: Option<PaymentDatum>, redeemer: Redeemer, _own_ref: OutputReference, self: Transaction) {
        expect Some(datum) = datum_otp
       expect Transaction{extra_signatories, validity_range, ..} = self
       when redeemer.action is{
        "refund"-> {
            and{
                key_signed(extra_signatories, datum.buyer)?,
                (datum.is_paid == 0)?,
                
            }
        }
        "getPaid"-> {
            and{
                key_signed(extra_signatories, datum.shopper)?,
                (datum.is_paid == 0)?,
                (timeCurrent >= datum.timeExpire)?,
            }
        }
        _-> fail
       
        
       }
    }
}