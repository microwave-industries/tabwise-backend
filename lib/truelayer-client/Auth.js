const axios = require(`axios`)
const FormData = require('form-data')

const {
  TRUELAYER_CLIENT_ID,
  TRUELAYER_CLIENT_SECRET
} = process.env

const AuthClient = axios.create({
  baseURL: `https://auth.truelayer.com`,
})

const getClientCredentialsGrant = async () => {
  try {
    const bodyFormData = new FormData()
    bodyFormData.append(`grant_type`, `client_credentials`)
    bodyFormData.append(`client_id`, TRUELAYER_CLIENT_ID)
    bodyFormData.append(`client_secret`, TRUELAYER_CLIENT_SECRET)
    bodyFormData.append(`scope`, `payments`)

    const { data } = await AuthClient.post(
      `/connect/token`,
      bodyFormData
    )
    const {
      access_token: accessToken,
      expires_in: expiresIn,
      token_type: tokenType
    } = data
    return {
      accessToken,
      expiresIn,
      tokenType
    }
  } catch (error) {
    if (error.isAxiosError) {
      console.error(error.toJSON())
    } else {
      console.error(error.data)
    }
  }

}

module.exports = {
  getClientCredentialsGrant
}