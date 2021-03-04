import {Neo4JDriver} from '../utils/Neo4JDriver';
import {QueryResult} from 'neo4j-driver';

export interface User
{
    id?: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: 0 | 1;
}

export class UserDAO
{
    /**
     * Creates an user with provided props in graph database
     * @param {User} props {username, email, firstName, lastName, gender}
     * @returns {Promise<User>} Created user object
     */
    public static async create(props: User): Promise<User>
    {
        const session = Neo4JDriver.instance.session();

        const keys = Object.keys(props);
        let createQuery = '';

        /*  createQuery will contain following lines:
            username : $username,
            firstName : $firstName,
            lastName : $lastName,
            email : $email,
            gender : $gender
            ... if additional fields will be added
         */
        for (const key of keys)
        {
            createQuery += `${key} : $${key},`;
        }
        createQuery = createQuery.slice(0, -1);

        try
        {
            const result: QueryResult = await session.run(
                `CREATE (n: User 
                    {
                        ${createQuery}
                    }
                ) RETURN properties(n) AS user, id(n) AS id`,
                props
            );

            const response: User = result.records[0].get('user');
            response.id = result.records[0].get('id').toString();
            return response;
        } finally
        {
            await session.close();
        }
    }

    /**
     * Retrieves an user from graph database by provided id
     * @param {string} id of the user to look for
     * @returns {Promise<User>} Found user object
     */
    public static async get(id: string): Promise<User>
    {
        const session = Neo4JDriver.instance.session();

        try
        {
            const result: QueryResult = await session.run(
                `MATCH (n: User) 
                        WHERE ID(n) = $id 
                        RETURN properties(n) AS user`,
                {id: Number(id)}
            );

            const response: User = result.records[0]?.get('user');

            if (!response)
            {
                return null;
            }

            response.id = id;
            return response;
        } finally
        {
            await session.close();
        }
    }

    /**
     * Returns an array of users from graph database with their ids
     * @returns {Promise<User[]>} array of users
     */
    public static async getAll(): Promise<User[]>
    {
        const session = Neo4JDriver.instance.session();

        try
        {
            const result: QueryResult = await session.run(
                `MATCH (n: User) 
                        RETURN properties(n) AS user, id(n) AS id`
            );

            const response: User[] = [];

            result.records?.forEach((record) =>
            {
                const user: User = record.get('user');
                user.id = record.get('id').toString();
                response.push(user);
            });

            return response;
        } finally
        {
            await session.close();
        }
    }

    /**
     * Deletes an user from graph database by provided id
     * @param {string} id of user to delete
     * @returns {Promise<void>}
     */
    public static async delete(id: string): Promise<void>
    {
        const session = Neo4JDriver.instance.session();

        try
        {
            await session.run(
                `MATCH (n: User) 
                        WHERE ID(n) = $id 
                        DELETE (n)`,
                {id: Number(id)}
            );
        } finally
        {
            await session.close();
        }
    }

    /**
     * Updates an user in graph database by provided id and props
     * @param {string} id of user to update
     * @param {User} props to update user with
     * @returns {Promise<User>} Updated user object
     */
    public static async update(id: string, props: User): Promise<User>
    {
        const session = Neo4JDriver.instance.session();

        try
        {
            const keys = Object.keys(props);
            let setQuery = '';

            /*  setQuery will contain following lines:
                 SET n.username = $username
                 SET n.firstName = $firstName
                 SET n.lastName = $lastName
                 SET n.email = $email
                 SET n.gender = $gender
                 ... if additional fields will be added
             */
            for (const key of keys)
            {
                setQuery += `SET n.${key} = $${key}\n`;
            }

            const result: QueryResult = await session.run(
                `MATCH (n: User)
                        WHERE ID(n) = $id 
                        ${setQuery} 
                        RETURN properties(n) AS user`,
                {id: Number(id), ...props}
            );

            const response: User = result.records[0].get('user');
            response.id = id;
            return response;
        } finally
        {
            await session.close();
        }
    }
}
