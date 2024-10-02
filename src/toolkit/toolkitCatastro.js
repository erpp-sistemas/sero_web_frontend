import instance from "../api/axios"

const checkCuenta = async (cuenta) => {
	const response = await instance.get(`/catastro/check/${cuenta}`)
	const boolean = response.data.exists
	return boolean
}

const addCuenta = async (data) => {
	const url=`/catastro`
	try {
		const res = await instance.post( url, data )
		return res
	} catch(error) {
		console.error(error)
	}
}

const editCuenta = async (data) => {
	const url=`/catastro/update`
	try {
		const res = await instance.put( url, data )
		return res
	} catch(error) {
		console.error(error)
	}
}

const getCuenta = async (cuenta) => {
	const url=`/catastro/cuenta/${cuenta}`
	try {
		const res = await instance.get( url )
		return res
	} catch(error) {
		console.error(error)
	}
}

const createPdf = async (data) => {
	const url=`/catastro/pdf`
	try {
		const res = await instance.post( url, data )
		return res
	} catch(error) {
		console.error(error)
	}
}

export default {
	checkCuenta,
	addCuenta,
	editCuenta,
	getCuenta,
	createPdf
}