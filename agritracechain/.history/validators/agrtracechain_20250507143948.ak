use cardano/address.{Address}
use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{Transaction, OutputReference}
use vodka_extra_signatories.{key_signed, one_of_keys_signed}
use vodka_validity_range.{valid_after}


pub type Datum{
    current_handler: VerificationKeyHash,
    receiver: VerificationKeyHash,
    data: ByteArray,
}
pub type Redeemer{
    action: ByteArray
}

validator agritracechain(
    codeEncryption: ByteArray,
    idProduct: Int, 
    receiverConfirm: VerificationKeyHash,
    price: Int
    ){
    spend(datum_otp: Option<Datum>, redeemer: Redeemer, _own_ref: OutputReference, self: Transaction) {
        expect Some(datum) = datum_otp
        expect Transaction{extra_signatories, ..} = self
        let signByCurrentHandler = key_signed(extra_signatories, datum.current_handler)
        when redeemer.action is{
            "UpdateHistory"->{
                and{
                signByCurrentHandler?,
                (receiverConfirm == datum.receiver) ?,
                (price == datum.price)?,
                }
            }
            _-> fail
            
        }
    }
}