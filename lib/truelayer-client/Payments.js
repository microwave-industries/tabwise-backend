const axios = require(`axios`)

const PaymentsClient = axios.create({
  baseURL: `https://pay-api.truelayer.com`
})

const createPayment = async (accessToken, {
  amount,
  currency = `GBP`,
  remitterRefernce = `TABSCANNER PAYMENT`,
  beneficiaryName = `some beneficiary`,
  beneficiarySortCode,
  beneficiary_account_number,
  beneficiaryReference = `TABSCANNER PAYMENT`,
  redirectUri,
} = {}) => {
  const { data } = await PaymentsClient.post(`/single-immediate-payments`, {
    amount,
    currency,
    remitter_reference: remitterRefernce,
    beneficiary_name: beneficiaryName,
    beneficiary_sort_code: beneficiarySortCode,
    beneficiary_account_number: beneficiary_account_number,
    beneficiary_reference: beneficiaryReference,
    redirect_uri: redirectUri
  })
  return data
}

const queryPayment = async (accessToken, simpId) => {
  const { data } = await PaymentsClient.get(`/single-immediate-payments/${simpId}`)
  return data
}