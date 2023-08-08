## Overview
Clone of the jsonplaceholder.typicode.com API with some changes.

Technologies: Node JS, Express, MongoDB, Mongoose, TypeScript

API server is deployed to the Fly service and running in a Docker container: https://node-jsonplaceholder-clone.fly.dev (add `/posts` or `/users`, for example)


## Routes
`/users` - GET (all), POST  
`/users/:id` - GET (by ID), PUT (by ID), PATCH (by ID), DELETE (by ID)  
`/users/:id/posts` - GET (all)  
`/users/:id/todos` - GET (all)  
`/users/:id/albums` - GET (all)

`/posts` - GET (all), POST  
`/posts/:id` - GET (by ID), PUT (by ID), PATCH (by ID), DELETE (by ID)  
`/posts/:id/comments` - GET (all)

`/comments` - GET (all), POST  
`/comments/:id` - GET (by ID), PUT (by ID), PATCH (by ID), DELETE (by ID) 

`/albums` - GET (all), POST  
`/albums/:id` - GET (by ID), PUT (by ID), PATCH (by ID), DELETE (by ID)  
`/albums/:id/photos` - GET (all)

`/photos` - GET (all), POST  
`/photos/:id` - GET (by ID), PUT (by ID), PATCH (by ID), DELETE (by ID) 

`/reset-data` - PUT (resets the test data in the DB)