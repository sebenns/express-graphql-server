# How to GraphQL with Express!

I had created and used this sample implementation in an extended form as part of a lecture. I had thought that nothing would contradict if I just share my approach :). 
Even for the reason that I had to search longer for a best practice and until the end I hadn't found one that would somehow correspond to my habits 🤷. 

Short and sweet: 'tis a [GraphQL](https://graphql.org/) server based on the [ExpressJs](https://expressjs.com/) web framework. On top of that, there is a connection to a 
[Neo4j](https://neo4j.com/) graph database that can be used with the community desktop client ... or simply run it briefly via [Docker](https://www.docker.com/) 🐳. 
All settings of the server can be edited and supplemented in the ⚙`start.cfg.json` found in the root directory of 📁[/src](https://github.com/sebenns/express-graphql-example/tree/master/src). 
The whole project is written in **TypeScript** - the much more comfortable and typed JavaScript. 

If you have any questions, feel free to contact me anytime ✨.

## What's included?

- Sample of a GraphQL **UserObject** with 🔎*Queries*  and  ✏*Mutations*.
- Data Access Object for database operations using Neo4js [*Cypher Queries*](https://neo4j.com/developer/cypher/).
- 🐳 Docker-Compose file for setting up a Neo4j database in one step.
- Some 'nice to have' project structure - if you are up for some neatness ✨.

## Let me use it already!

Sure, no problem. **First of all** make sure you have all necessary dependencies installed on your machine, where you want to use this code.

| You need | Where to get |
| ------ | ------ |
| NodeJs & npm | https://nodejs.org/en/ |
| Docker (optional) | https://www.docker.com/ |
| Neo4j Desktop Client (optional) | https://neo4j.com/download/ |

 
After you have prepared your machine you are ready to fork, clone and **install** all 📁`node_modules` listed in the ⚙`package.json` file by running `npm install`
in the *root directory* of your project. **Make sure** you have a running instance of your Neo4j database. If you want to go with docker just run `docker-compose up`.

**Now** you can start the server with `npm start`. All typescript files will be compiled and you server will be available on http://localhost:8000/graphql by default.
You can edit the port of your server in the ⚙`start.cfg.json` in the directory of 📁[/src](https://github.com/sebenns/express-graphql-example/tree/master/src).

As already mentioned, if you have any problems, feel free to contact me.

## Usage Guide

Your [GraphiQL IDE](https://github.com/graphql/graphiql) will be available on http://localhost:8000/graphql. I will just go through some 🔎*Queries*  and  ✏*Mutations* and 
explain them here. If you wanna get more insights into GraphQL, feel free to browse through their great [documentation](https://graphql.org/learn/) 📖.

### Queries

UserQueries can be found in 📄[`UserSchema.ts`](https://github.com/sebenns/express-graphql-example/blob/master/src/schemes/UserSchema.ts). They will be used to query data 
in relation to the defined GraphQLObjectType 🙍`User`. The queries consist of the *name* of the query that can be called later, the *GraphQLObjectType* that is used, 
possible arguments and the *resolver*. The purpose of the query is determined **with** the help of the resolver. 
In our case we call the 📄[`UserDAO`](https://github.com/sebenns/express-graphql-example/blob/master/src/neo4j/UserDAO.ts) and access the database.

<table>
<tr>
  <th> Request </th>
  <th> Response </th>
</tr>

<tr>
 <td>
  <pre>
   query allUser { 
   users
   {
      id,
      firstName,
      lastName,
      username,
      email,
      gender
   }}
  </pre>
 </td>
 <td>
  <pre>
 {
  "data": {
    "users": [
      {
        "id": "0",
        "firstName": "Sebastian",
        "lastName": "Enns",
        "username": "Senns",
        "email": "mail@mailing.com",
        "gender": "male"
      },
      ...
     ]
   }
 }
  </pre>
 </td>
</tr>
</table>

After you have added some users with the explained mutations below, you can use this query to get a list of created users. Just try it out and 
write or copy this query right into your GraphiQL IDE ✨.

### Mutations

In this sample implementation we will use mutations as a method to change values according to our defined GraphQLObjectType. Mutations can be found in 
📄[`UserSchema.ts`](https://github.com/sebenns/express-graphql-example/blob/master/src/schemes/UserSchema.ts). We interpret any change, no matter how small or even 
the addition of new data **as** a mutation. The structure of a mutation is similar to that of a query. We have the *name* of our mutation, 
the *GraphQLObjectType* we are working on, as well as possible arguments and the *resolver*. Again, the resolver defines the further operation after calling the mutation. 
In this case, access to the 📄[`UserDAO`](https://github.com/sebenns/express-graphql-example/blob/master/src/neo4j/UserDAO.ts) to create, edit and delete users.

<table>
<tr>
  <th> Request </th>
  <th> Response </th>
</tr>

<tr>
 <td>
  <pre>
  mutation addUser {
  createUser(props: 
  {
   	firstName: "Sebastian",
   	lastName: "Enns",   	
   	username: "Senns",
   	email: "mail@mailing.com",
   	gender: male
  })
  {
    id, 
    firstName, 
    lastName,
    username,
    email, 
    gender
  }}
  </pre>
 </td>
 <td>
  <pre>
  {
  "data": {
    "createUser": {
      "id": "0",
      "firstName": "Sebastian",
      "lastName": "Enns",
      "username": "Senns",
      "email": "mail@mailing.com",
      "gender": "male"
      }
    }
  }
  </pre>
 </td>
</tr>
</table>

The mutation used above will create a new user in the Neo4j graph database. We will use `props` as a providable argument containing all necessary information according to create
a new user. Feel free to write or copy the query and to execute it in your GraphiQL IDE ✨. Perhaps it is worth a try to make some changes and try to add new fields to the
GraphQLObjectType 🙍`User` and to the GraphQLObjectInputType 🙆`UserInput` to get into the usage of both ObjectTypes. 

<table>
<tr>
  <th> Request </th>
  <th> Response </th>
</tr>

<tr>
 <td>
  <pre>
  mutation updateUser {
  updateUser(id: 0, props: 
  {
    username: "Sebb"
  })
  {
    id,
    firstName,
    lastName,
    username
  }}
  </pre>
 </td>
 <td>
   <pre>
 {
  "data": {
    "updateUser": {
      "id": "0",
      "firstName": "Sebastian",
      "lastName": "Enns",
      "username": "Sebb"
      }
    }
  }
   </pre>
 </td>
</tr>
</table>

Last but not least, this mutation will update an user by provided identifier and props. As it is currently implemented, it will be your decision which fields
you want to update. If you are wondering why there is another body in both mutations filled with user attributes: these are used to determine the attributes 
of the answer we get back. In both resolvers, we get back the *changed object* in the database.

## Conclusion

With this repository I don't want to forget my *short work* with GraphQL on the one hand and on the other hand I want to help other developers to get an *ease* start 
with GraphQL. **In my opinion**, I find especially the proper structuring of the possible queries and mutations a challenge to face. The rest really comes naturally.

As always, the proof of the pudding is in the eating. If you have any open questions, feel free to contact me at any time.
If something pops into my head, I'll expand the repository of course ✨. 



