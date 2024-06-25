import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
const AWS_BUCKET_NAME = "bucket-files-msg"
const AWS_BUCKET_REGION = "us-east-2"
const AWS_PUBLIC_KEY = "AKIAT5FEWJS6OYP6WLHR"
const AWS_SECRET_KEY = "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"

const client = new S3Client({
	region: AWS_BUCKET_REGION,
	credentials: {
		accessKeyId: AWS_PUBLIC_KEY,
		secretAccessKey: AWS_SECRET_KEY,
	},
})

export const listObjects = async () => {
	try {
		const command = new ListObjectsV2Command({
			Bucket: AWS_BUCKET_NAME,
		})
		const response = await client.send(command)
		response.Contents.forEach((object) => {
			return(object.Key)
		})
	} catch (err) {
		console.error("Error al listar objetos:", err.stack)
	}
}

export const uploadToS3 = async (file) => {
	try {
		const params = {
			Bucket: AWS_BUCKET_NAME,
			Key: file.name,
			Body: file,
		}

		const command = new PutObjectCommand(params)
		await client.send(command)
		const signer = await getSignedUrl(client, new GetObjectCommand({ Bucket: AWS_BUCKET_NAME, Key: file.name }), { expiresIn: 604800 })
		const fileUrl = `${signer}`
		return fileUrl

	} catch (err) {
		console.error("Error al subir archivo:", err.stack)
		throw err
	}
}