# 🔗 lomkit-rest-client

> A Nuxt 3 SDK to easily interact with [lomkit/laravel-rest-api](https://github.com/lomkit/laravel-rest-api) endpoints — powered by TypeScript, designed for Vue/Nuxt ⚡️

**Note:** This package is community-built and not officially affiliated with Lomkit. It’s fully open-source and contributions are welcome!

---

## ✨ Features

-   📦 Resource-based client
-   🔐 Built-in token handling via cookies
-   ⚙️ Configurable base API URL and token cookie name
-   🌍 Works seamlessly with Nuxt 3 and TypeScript

---

## 📦 Installation

```bash
npm install lomkit-rest-client
```

## ⚙️ Configuration

```typescript
// plugins/restClient.ts
export default defineNuxtPlugin(() => {
	const lomkitRestClient = useNuxtApp().$lomkitRestClient;
	lomkitRestClient.addApiClient({
		slug: "default",
		url: "https://jsonplaceholder.typicode.com",
		requestInit: () => {
			const access_token = useCookie("cookie");
			return {
				headers: {
					Authorization: `Bearer ${access_token.value}`,
				},
				credentials: "include",
			};
		},
	});
});
```

# 📚 useResource

The `useResource` composable is the main entry point for interacting with the Lomkit REST API. It allows you to create a resource client that can perform various operations on a specific resource.

The `useResource<T>(resourceName, resourceConfig?)` composable returns an object with methods to interact with a specific resource via the Lomkit REST API. See the [methods](#methods) section for more details.

```ts
const productsResource = useResource<IProduct>("products", {
	search: { limit: 10 },
});
```

## <a id="methods"></a> 🧩 Methods

### 🔎 `search(request?)`

Search for resources based on the request parameters. (See [Search](https://laravel-rest-api.lomkit.com/endpoints/search) for more details.)

```TypeScript
const products = await productsResource.search({
    filters: [{
        field: "name",
        name: "Product Name",
    }],
    includes: [
        {
            relation: "category",
        }
    ]
}).catch((err) => console.error("Error during search: " ,err));
```

### 🔎 `findOne(request?)`

Returns the first matching resource. (See [Search](https://laravel-rest-api.lomkit.com/endpoints/search) for more details.)

```TypeScript
const product = await productsResource.findOne({
    filters: [{
        field: "name",
        name: "Product Name",
    }],
});
```

### 🔎 `findOneById(id)`

Returns a resource by its ID.

```TypeScript
const product = await productsResource.findOneById(1);
```

### 🧾 `details()`

Returns the details of a resource. (See [Details](https://laravel-rest-api.lomkit.com/endpoints/details) for more details.)

```TypeScript
const details = await productsResource.details();
```

### ✏️ `mutate(mutations)`

Mutate a resource with the provided mutations. (See [Mutate](https://laravel-rest-api.lomkit.com/endpoints/mutate) for more details.)

```TypeScript
const response = await productsResource.mutate([
        {
            operation: "update",
            key: 2,
            relations: {
                star: {
                    operation: "attach",
                    key: 1
                }
            }
        },
]).catch((err) => console.error("Error during mutation: " ,err));
```

### ⚙️ `actions(actionName, params?)`

Execute a specific action on a resource. (See [Actions](https://laravel-rest-api.lomkit.com/endpoints/actions) for more details.)

```TypeScript
const response = await productsResource.actions("publish", {
  search: {
    filters: [{ field: 'id', value: 1 }]
  }
});
```

### 🗑️ `remove(ids)`

Delete resources by their IDs. (See [Delete](https://laravel-rest-api.lomkit.com/endpoints/delete) for more details.)

```TypeScript
const response = await productsResource.remove([1, 2]);
```

## Contributions

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request on the [GitHub repository](https://github.com/edepauw/lomkit-rest-client).

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
