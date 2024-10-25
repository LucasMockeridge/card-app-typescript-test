import { Entry } from "@prisma/client";
import Prisma from "../src/db";
import { server } from "../src/server";

describe("test backend API", () => {
  it("POST /create/ should add a valid entry; DELETE /delete/ should remove a valid entry", async () => {

	  // Create a dummy entry
    const newEntry = {
      title: "Test",
      description: "Test description.",
      created_at: new Date().toISOString(),
      scheduled: new Date().toISOString(),
    };

    // Add dummy entry to database
    let response = await server.inject({
      method: "POST",
      url: "/create/",
      payload: newEntry,
    });

    expect(response.statusCode).toEqual(200);

    // Retrieve id
    let payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("id");
    let id = payload.id;
    expect(payload).toEqual({ id, ...newEntry });

    // Find entry in database using id
    response = await server.inject({
      method: "GET",
      url: "/get/" + id,
    });

    expect(response.statusCode).toEqual(200);
    payload = JSON.parse(response.payload);
    expect(payload).toEqual({ id, ...newEntry });

    // Find entry in database by fetching all entries
    response = await server.inject({
      method: "GET",
      url: "/get/",
    });

    expect(response.statusCode).toEqual(200);
    payload = JSON.parse(response.payload);
    expect(payload).toBeInstanceOf(Array);
    expect(payload).toContainEqual({ id, ...newEntry });

    // Remove entry from database
    response = await server.inject({
      method: "DELETE",
      url: "/delete/" + id,
    });

    expect(response.statusCode).toEqual(200);

    // Check entry has gone using id
    response = await server.inject({
      method: "GET",
      url: "/get/" + id,
    });

    expect(response.statusCode).toEqual(500);

    // Check entry has gone by fetching all entries
    response = await server.inject({
      method: "GET",
      url: "/get/",
    });

    expect(response.statusCode).toEqual(200);
    payload = JSON.parse(response.payload);
    expect(payload).toBeInstanceOf(Array);
    expect(payload).not.toContainEqual({ id, ...newEntry });
  });
  it("POST /create/ should stop a duplicate entry", async () => {
	  // Create a dummy entry
    const newEntry = {
      title: "Test",
      description: "Test description.",
      created_at: new Date().toISOString(),
      scheduled: new Date().toISOString(),
    };

    // Add dummy entry to database
    let response = await server.inject({
      method: "POST",
      url: "/create/",
      payload: newEntry,
    });

    expect(response.statusCode).toEqual(200);

	// Retrieve id
    let payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("id");
    let id = payload.id;
    expect(payload).toEqual({ id, ...newEntry });

    // Add duplicate entry to database
    response = await server.inject({
      method: "POST",
      url: "/create/",
      payload: { id, ...newEntry },
    });

    expect(response.statusCode).toEqual(500);

	// Find entry in database using id
    response = await server.inject({
      method: "GET",
      url: "/get/" + id,
    });

    expect(response.statusCode).toEqual(200);
    payload = JSON.parse(response.payload);
    expect(payload).toEqual({ id, ...newEntry });

    // Find entry in database by fetching all entries
    response = await server.inject({
      method: "GET",
      url: "/get/",
    });

    expect(response.statusCode).toEqual(200);
    payload = JSON.parse(response.payload);
    expect(payload).toBeInstanceOf(Array);
    expect(payload).toContainEqual({ id, ...newEntry });

    // Remove entry from database
    response = await server.inject({
      method: "DELETE",
      url: "/delete/" + id,
    });

    expect(response.statusCode).toEqual(200);

    // Check entry has gone using id
    response = await server.inject({
      method: "GET",
      url: "/get/" + id,
    });

    expect(response.statusCode).toEqual(500);

    // Check entry has gone by fetching all entries
    response = await server.inject({
      method: "GET",
      url: "/get/",
    });

    expect(response.statusCode).toEqual(200);
    payload = JSON.parse(response.payload);
    expect(payload).toBeInstanceOf(Array);
    expect(payload).not.toContainEqual({ id, ...newEntry });
  });

  it("POST /create/ should not add an invalid entry", async () => {
	  // Create an invalid entry
    const newEntry = {
      description: "Test description.",
      created_at: new Date().toISOString(),
      scheduled: new Date().toISOString(),
    };

// Add invalid entry to database
    let response = await server.inject({
      method: "POST",
      url: "/create/",
      payload: newEntry,
    });

    expect(response.statusCode).toEqual(500);
  });

  it("PUT /update/ should update a valid entry; DELETE /delete/ should remove an updated entry", async () => {
	 // Create a dummy entry
    const newEntry = {
      title: "Test",
      description: "Test description.",
      created_at: new Date().toISOString(),
      scheduled: new Date().toISOString(),
    };

    // Add dummy entry to database
    let response = await server.inject({
      method: "POST",
      url: "/create/",
      payload: newEntry,
    });

    expect(response.statusCode).toEqual(200);

    // Retrieve id
    let payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("id");
    let id = payload.id;
    expect(payload).toEqual({ id, ...newEntry });

    // Update dummy entry
    response = await server.inject({
      method: "PUT",
      url: "/update/" + id,
      payload: {
        title: "Updated Title",
      },
    });

    expect(response.statusCode).toEqual(200);

    // Check update using id
    response = await server.inject({
      method: "GET",
      url: "/get/" + id,
    });

    expect(response.statusCode).toEqual(200);
    payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("title");
    expect(payload.title).toEqual("Updated Title");

    // Check update by fetching all entries
    response = await server.inject({
      method: "GET",
      url: "/get/",
    });

    expect(response.statusCode).toEqual(200);
    payload = JSON.parse(response.payload);
    expect(payload).toBeInstanceOf(Array);
    expect(payload).toContainEqual(expect.objectContaining({ id, title: "Updated Title" }));

    // Remove updated entry from database
    response = await server.inject({
      method: "DELETE",
      url: "/delete/" + id,
    });

    expect(response.statusCode).toEqual(200);

        // Check entry has gone using id
    response = await server.inject({
      method: "GET",
      url: "/get/" + id,
    });

    expect(response.statusCode).toEqual(500);

    // Check entry has gone by fetching all entries
    response = await server.inject({
      method: "GET",
      url: "/get/",
    });

    expect(response.statusCode).toEqual(200);
    payload = JSON.parse(response.payload);
    expect(payload).toBeInstanceOf(Array);
    expect(payload).not.toContainEqual(expect.objectContaining({ id, title: "Updated Title" }));
  });
  it("PUT /update/ should stop an invalid update", async () => {
	  // Create a dummy entry
    const newEntry = {
      title: "Test",
      description: "Test description.",
      created_at: new Date().toISOString(),
      scheduled: new Date().toISOString(),
    };

    // Add dummy entry to database
    let response = await server.inject({
      method: "POST",
      url: "/create/",
      payload: newEntry,
    });

    expect(response.statusCode).toEqual(200);

    // Retrieve id
    let payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("id");
    let id = payload.id;
    expect(payload).toEqual({ id, ...newEntry });

    // Update dummy entry with bad field
    response = await server.inject({
      method: "PUT",
      url: "/update/" + id,
      payload: {
        field: "Bad Field",
      },
    });

    expect(response.statusCode).toEqual(500);

    // Remove entry from database
    response = await server.inject({
      method: "DELETE",
      url: "/delete/" + id,
    });

    expect(response.statusCode).toEqual(200);

    // Check entry has gone using id 
    response = await server.inject({
      method: "GET",
      url: "/get/" + id,
    });

    expect(response.statusCode).toEqual(500);

    // Check entry has gone by fetching all entries 
    response = await server.inject({
      method: "GET",
      url: "/get/",
    });

    expect(response.statusCode).toEqual(200);
    payload = JSON.parse(response.payload);
    expect(payload).toBeInstanceOf(Array);
    expect(payload).not.toContainEqual({ id, ...newEntry });
  });

  it("PUT /update/ should not create an entry", async () => {
	  // Create a dummy entry
    const newEntry = {
      id: 5000,
      title: "Test",
      description: "Test description.",
      created_at: new Date().toISOString(),
      scheduled: new Date().toISOString(),
    };

    // Attempt to add entry to database
    let response = await server.inject({
      method: "PUT",
      url: "/update/5000",
      payload: newEntry,
    });

    expect(response.statusCode).toEqual(500);

    // Check entry was not added using id
    response = await server.inject({
      method: "GET",
      url: "/get/5000",
    });

    expect(response.statusCode).toEqual(500);

    // Check entry was not added by fetching all entries
    response = await server.inject({
      method: "GET",
      url: "/get/",
    });

    expect(response.statusCode).toEqual(200);
    let payload = JSON.parse(response.payload);
    expect(payload).toBeInstanceOf(Array);
    expect(payload).not.toContainEqual(newEntry);
  });

  it("DELETE /delete/ should stop an invalid delete", async () => {
	  // Attempt to remove a phantom entry
    let response = await server.inject({
      method: "DELETE",
      url: "/delete/5000",
    });

    expect(response.statusCode).toEqual(500);

    // Check entry was not added using id
    response = await server.inject({
      method: "GET",
      url: "/get/5000",
    });

    expect(response.statusCode).toEqual(500);

    // Check entry was not added by fetching all entries
    response = await server.inject({
      method: "GET",
      url: "/get/",
    });

    expect(response.statusCode).toEqual(200);
    let payload = JSON.parse(response.payload);
    expect(payload).toBeInstanceOf(Array);
    expect(payload).not.toContainEqual(expect.objectContaining({ id: 5000 }));
  });
});
