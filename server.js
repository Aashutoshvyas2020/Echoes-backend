const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const twilio = require('twilio')
const axios = require('axios')
const fs = require('fs')














fileContent = fs.readFileSync('./prompts_final.json')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/test', (req, res) => {
    res.send("Check")
})

app.post('/', async (req, res) => {

    const { name, phone_number, reason, character } = req.body

    const character_info = JSON.parse(fileContent)[character]
    console.log(character_info)

    const account_sid = process.env.TWILIO_ACCOUNT_SID
    const auth_token = process.env.TWILIO_AUTH_TOKEN
    const client = twilio(account_sid, auth_token)

    const config_id = process.env.HUME_CONFIG_ID
    const api_key = process.env.HUME_API_KEY

    const config_name = `${character} ${Math.round(Math.random()*99999) + Number(new Date())} config` 
    try {

        // // creating the hume config
        const request_body = {
            "evi_version": "3",
            "name": config_name,
            "prompt": {
                "text": character_info['prompt'] + `  The user name is ${name} and their reason for calling is ${reason}`,
            },
            "voice": {
                "id": character_info['voiceID'],
                "provider": "CUSTOM_VOICE"
            },
            "language_model": {
                "model_provider": "GOOGLE",
                "model_resource": "gemini-2.5-flash",
                "temperature": 1
            },
            "event_messages": {
                "on_new_chat": {
                "enabled": true,
                "text": ""
                },
                "on_inactivity_timeout": {
                "enabled": true,
                "text": ""
                },
                "on_max_duration_timeout": {
                "enabled": false,
                "text": ""
                }
            },
            "ellm_model": {
                "allow_short_responses": true
            }
        }


        const header = {
            "X-Hume-Api-Key" : process.env.HUME_API_KEY,
            'Content-Type' : 'application/json'
        }
        const response = await axios.post('https://api.hume.ai/v0/evi/configs', request_body, { headers: header })
        const hume_config_id_ = response.data.id
        console.log(hume_config_id_)
        const call = await client.calls.create({
            to: phone_number,
            from: process.env.TWILIO_PHONE_NUMBER,
            url: `https://api.hume.ai/v0/evi/twilio?config_id=${hume_config_id_}&api_key=${process.env.HUME_API_KEY}`
        })

        
        console.log(`Call status: ${call.status}`)
        console.log(`Call SID: ${call.sid}`)
        return res.status(200).json({
            'Call status': call.status,
            'Call SID': call.sid
        })
    } catch (error) {
        console.error('Error making call:', error)
        return res.status(400).json({
            error
        })
    }
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`You're server is running on http://localhost:${PORT}`))