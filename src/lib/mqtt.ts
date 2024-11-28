import mqtt, { MqttClient, IClientOptions } from 'mqtt'

export class MQTTService {
  private client: MqttClient | null = null
  private static instance: MQTTService

  private constructor() {}

  static getInstance(): MQTTService {
    if (!MQTTService.instance) {
      MQTTService.instance = new MQTTService()
    }
    return MQTTService.instance
  }

  connect(): Promise<MqttClient> {
    return new Promise((resolve, reject) => {
      const options: IClientOptions = {
        protocol: 'wss',
        hostname: process.env.NEXT_PUBLIC_HIVE_URL,
        port: 8884,
        username: process.env.NEXT_PUBLIC_HIVE_USERNAME,
        password: process.env.NEXT_PUBLIC_HIVE_PASSWORD,
        clientId: `mqtt-dashboard-${Math.random().toString(16).substr(2, 8)}`,
        rejectUnauthorized: false,
      }

      this.client = mqtt.connect(`wss://${options.hostname}:${options.port}/mqtt`, options)

      this.client.on('connect', () => {
        console.log('Connected to MQTT broker')
        resolve(this.client!)
      })

      this.client.on('error', (err) => {
        console.error('MQTT connection error:', err)
        reject(err)
      })

      // Add more event listeners for debugging
      this.client.on('message', (topic, message) => {
        console.log('Received message:', { topic, message: message.toString() })
      })

      this.client.on('disconnect', () => {
        console.log('Disconnected from broker')
      })

      this.client.on('reconnect', () => {
        console.log('Attempting to reconnect')
      })
    })
  }

  subscribe(topic: string, qos: 0 | 1 | 2 = 0) {
    if (!this.client) throw new Error('MQTT client not connected')
    console.log('Subscribing to topic:', topic, 'with QoS:', qos)
    return this.client.subscribe(topic, { qos }, (err, granted) => {
      if (err) {
        console.error('Subscribe error:', err)
      } else {
        console.log('Subscription granted:', granted)
      }
    })
  }

  publish(topic: string, message: string, qos: 0 | 1 | 2 = 0) {
    if (!this.client) throw new Error('MQTT client not connected')
    console.log('Publishing message:', { topic, message, qos })
    return this.client.publish(topic, message, { qos }, (err) => {
      if (err) {
        console.error('Publish error:', err)
      } else {
        console.log('Message published successfully')
      }
    })
  }

  unsubscribe(topic: string) {
    if (!this.client) throw new Error('MQTT client not connected')
    return this.client.unsubscribe(topic)
  }

  onMessage(callback: (topic: string, message: Buffer) => void) {
    if (!this.client) throw new Error('MQTT client not connected')
    this.client.on('message', callback)
  }

  disconnect() {
    if (this.client) {
      this.client.end()
      this.client = null
    }
  }
} 