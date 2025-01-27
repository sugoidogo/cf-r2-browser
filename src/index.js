export default {
	async fetch(request, env) {
		const url = new URL(request.url)
		const bucketName = env[url.hostname]
		const bucket = env[bucketName]
		const objectName = url.pathname.substring(1)
		if (request.method === 'GET') {
			if (!objectName || objectName.endsWith('/')) {
				const options = { 
					prefix: objectName,
					delimiter: '/',
					include: []
				}
				let listing = null
				const list = new Set()
				do {
					listing = await bucket.list(options)
					options.cursor = listing.cursor
					for (const object of listing.objects) {
						/** @type {String} */
						let itemName = object.key.slice(objectName.length)
						const length=itemName.indexOf('/') + 1
						if(length>0){
							itemName=itemName.substring(0,length)
						}
						list.add(itemName)
					}
				} while (listing.truncated)
				if (list.size === 0) {
					return new Response(null, { status: 404 })
				}
				let body = '<h1>listing of /' + objectName + '</h1><br>'
				for (const itemName of list) {
					body += '<a href="' + itemName + '">' + itemName + '</a><br>'
				}
				return new Response(body, { headers: { 'content-type': 'text/html' } })
			}

			const object = await bucket.get(objectName, {
				range: request.headers,
				onlyIf: request.headers,
			})

			if (object === null) {
				return new Response(null, { status: 404 })
			}

			const headers = new Headers()
			object.writeHttpMetadata(headers)
			headers.set('etag', object.httpEtag)
			if (object.range) {
				headers.set("content-range", `bytes ${object.range.offset}-${object.range.end ?? object.size - 1}/${object.size}`)
			}
			const status = object.body ? (request.headers.get("range") !== null ? 206 : 200) : 304
			return new Response(object.body, { status: status, headers: headers })
		}

		if (request.method === 'HEAD') {
			const object = await bucket.head(objectName)

			if (object === null) {
				return new Response(null, { status: 404 })
			}

			const headers = new Headers()
			object.writeHttpMetadata(headers)
			headers.set('etag', object.httpEtag)
			return new Response(null, { headers: headers })
		}
	}
}