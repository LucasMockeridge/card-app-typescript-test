import { server } from "../src/server"
import Prisma from "../src/db";
import { Entry } from "@prisma/client";

describe("test backend API", () => {
	it("POST /create/ should add a valid entry; DELETE /delete/ should remove a valid entry", async () => {
		const newEntry = {
                        title: "Test",
                        description: "Test description.",
                        created_at: new Date().toISOString(),
                        scheduled: new Date().toISOString(),
                }

                let response = await server.inject({
                        method: 'POST',
                        url: '/create/',
                        payload: newEntry
                })
		
		expect(response.statusCode).toEqual(200)
		let payload = JSON.parse(response.payload)
		expect(payload).toHaveProperty("id")
		let id = payload.id
		expect(payload).toEqual({id, ...newEntry})

		response = await server.inject({
                        method: 'GET',
                        url: '/get/' + id,
                })

		expect(response.statusCode).toEqual(200)
                payload = JSON.parse(response.payload)
		expect(payload).toEqual({id, ...newEntry})

		response = await server.inject({
                        method: 'GET',
                        url: '/get/',
                })

                expect(response.statusCode).toEqual(200)
                payload = JSON.parse(response.payload)
		expect(payload).toBeInstanceOf(Array)
                expect(payload).toContainEqual({id, ...newEntry})

		response = await server.inject({
                        method: 'DELETE',
                        url: '/delete/' + id,
                })

		expect(response.statusCode).toEqual(200)

                response = await server.inject({
                        method: 'GET',
                        url: '/get/' + id,
                })

                expect(response.statusCode).toEqual(500)

                response = await server.inject({
                        method: 'GET',
                        url: '/get/',
                })

                expect(response.statusCode).toEqual(200)
                payload = JSON.parse(response.payload)
                expect(payload).toBeInstanceOf(Array)
                expect(payload).not.toContainEqual({id, ...newEntry})



  });
           it("POST /create/ should stop a duplicate entry", async () => {
		const newEntry = {
                        title: "Test",
                        description: "Test description.",
                        created_at: new Date().toISOString(),
                        scheduled: new Date().toISOString(),
                }

                let response = await server.inject({
                        method: 'POST',
                        url: '/create/',
                        payload: newEntry
                })

                expect(response.statusCode).toEqual(200)
                let payload = JSON.parse(response.payload)
                expect(payload).toHaveProperty("id")
                let id = payload.id
                expect(payload).toEqual({id, ...newEntry})

		response = await server.inject({
                        method: 'POST',
                        url: '/create/',
                        payload: {id, ...newEntry}
                })

		expect(response.statusCode).toEqual(500)

		response = await server.inject({
                        method: 'GET',
                        url: '/get/' + id,
                })

                expect(response.statusCode).toEqual(200)
                payload = JSON.parse(response.payload)
                expect(payload).toEqual({id, ...newEntry})

                response = await server.inject({
                        method: 'GET',
                        url: '/get/',
                })

                expect(response.statusCode).toEqual(200)
                payload = JSON.parse(response.payload)
                expect(payload).toBeInstanceOf(Array)
                expect(payload).toContainEqual({id, ...newEntry})

                response = await server.inject({
                        method: 'DELETE',
                        url: '/delete/' + id,
                })

                expect(response.statusCode).toEqual(200)

                response = await server.inject({
                        method: 'GET',
                        url: '/get/' + id,
                })

                expect(response.statusCode).toEqual(500)

                response = await server.inject({
                        method: 'GET',
                        url: '/get/',
                })

                expect(response.statusCode).toEqual(200)
                payload = JSON.parse(response.payload)
                expect(payload).toBeInstanceOf(Array)
               	expect(payload).not.toContainEqual({id, ...newEntry})

});

	it("POST /create/ should not add an invalid entry", async () => {
		const newEntry = {
                        description: "Test description.",
                        created_at: new Date().toISOString(),
                        scheduled: new Date().toISOString(),
                }

                let response = await server.inject({
                        method: 'POST',
                        url: '/create/',
                        payload: newEntry
                })
		
		expect(response.statusCode).toEqual(500)

  });

          it("PUT /update/ should update a valid entry; DELETE /delete/ should remove an updated entry", async () => {
		const newEntry = {
                        title: "Test",
                        description: "Test description.",
                        created_at: new Date().toISOString(),
                        scheduled: new Date().toISOString(),
                }

                let response = await server.inject({
                        method: 'POST',
                        url: '/create/',
                        payload: newEntry
                })

                expect(response.statusCode).toEqual(200)
                let payload = JSON.parse(response.payload)
                expect(payload).toHaveProperty("id")
                let id = payload.id
                expect(payload).toEqual({id, ...newEntry})

                response = await server.inject({
                        method: 'PUT',
                        url: '/update/' + id,
			payload: {
        			title: "Updated Title"
      			}
                })

                expect(response.statusCode).toEqual(200)

		response = await server.inject({
                        method: 'GET',
                        url: '/get/' + id,
                })

                expect(response.statusCode).toEqual(200)
                payload = JSON.parse(response.payload)
		expect(payload).toHaveProperty("title")
                expect(payload.title).toEqual("Updated Title")

                response = await server.inject({
                        method: 'GET',
                        url: '/get/',
                })

                expect(response.statusCode).toEqual(200)
                payload = JSON.parse(response.payload)
                expect(payload).toBeInstanceOf(Array)
                expect(payload).toContainEqual(expect.objectContaining({ id, title : "Updated Title" }))

		response = await server.inject({
                        method: 'DELETE',
                        url: '/delete/' + id,
                })

                expect(response.statusCode).toEqual(200)

                response = await server.inject({
                        method: 'GET',
                        url: '/get/' + id,
                })

                expect(response.statusCode).toEqual(500)

                response = await server.inject({
                        method: 'GET',
                        url: '/get/',
                })

                expect(response.statusCode).toEqual(200)
                payload = JSON.parse(response.payload)
                expect(payload).toBeInstanceOf(Array)
                expect(payload).not.toContainEqual(expect.objectContaining({ id, title : "Updated Title" }))


  });
          it("PUT /update/ should stop an invalid update", async () => {
		const newEntry = {
                        title: "Test",
                        description: "Test description.",
                        created_at: new Date().toISOString(),
                        scheduled: new Date().toISOString(),
                }

                let response = await server.inject({
                        method: 'POST',
                        url: '/create/',
                        payload: newEntry
                })

                expect(response.statusCode).toEqual(200)
                let payload = JSON.parse(response.payload)
                expect(payload).toHaveProperty("id")
                let id = payload.id
                expect(payload).toEqual({id, ...newEntry})

                response = await server.inject({
                        method: 'PUT',
                        url: '/update/' + id,
			payload: {
        			field: "Bad Field"
      			}
                })

                expect(response.statusCode).toEqual(500)

		response = await server.inject({
                        method: 'DELETE',
                        url: '/delete/' + id,
                })

                expect(response.statusCode).toEqual(200)

                response = await server.inject({
                        method: 'GET',
                        url: '/get/' + id,
                })

                expect(response.statusCode).toEqual(500)

                response = await server.inject({
                        method: 'GET',
                        url: '/get/',
                })

                expect(response.statusCode).toEqual(200)
                payload = JSON.parse(response.payload)
                expect(payload).toBeInstanceOf(Array)
                expect(payload).not.toContainEqual({id, ...newEntry})

  });

           it("PUT /update/ should not create an entry", async () => {
                const newEntry = {
			id: 5000,
                        title: "Test",
                        description: "Test description.",
                        created_at: new Date().toISOString(),
                        scheduled: new Date().toISOString(),
                }

                let response = await server.inject({
                        method: 'PUT',
                        url: '/update/5000',
                        payload: newEntry
                })

                expect(response.statusCode).toEqual(500)
		
		response = await server.inject({
                        method: 'GET',
                        url: '/get/5000',
                })

                expect(response.statusCode).toEqual(500)

                response = await server.inject({
                        method: 'GET',
                        url: '/get/',
                })

                expect(response.statusCode).toEqual(200)
                let payload = JSON.parse(response.payload)
                expect(payload).toBeInstanceOf(Array)
                expect(payload).not.toContainEqual(newEntry)

});

           it("DELETE /delete/ should stop an invalid delete", async () => {
                let response = await server.inject({
                        method: 'DELETE',
                        url: '/delete/5000'
                })

                expect(response.statusCode).toEqual(500)

                response = await server.inject({
                        method: 'GET',
                        url: '/get/5000',
                })

                expect(response.statusCode).toEqual(500)

                response = await server.inject({
                        method: 'GET',
                        url: '/get/',
                })

                expect(response.statusCode).toEqual(200)
                let payload = JSON.parse(response.payload)
                expect(payload).toBeInstanceOf(Array)
                expect(payload).not.toContainEqual(expect.objectContaining({ id : 5000}))

});


});
