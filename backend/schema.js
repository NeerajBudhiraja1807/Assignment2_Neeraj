const {
    GraphQLObjectType, GraphQLSchema, GraphQLString,
    GraphQLID, GraphQLList, GraphQLFloat
} = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Employee = require('./models/Employee');

const ERROR = {
    UNAUTHORIZED: "Unauthorized access. Token required.",
    USER_NOT_FOUND: "User not found",
    INVALID_PASSWORD: "Incorrect password",
    EMAIL_EXISTS: "Email is already registered."
};

// User Type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString }
    })
});

// Employee Type
const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: () => ({
        id: { type: GraphQLID },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        gender: { type: GraphQLString },
        designation: { type: GraphQLString },
        salary: { type: GraphQLFloat },
        date_of_joining: { type: GraphQLString },
        department: { type: GraphQLString },
        employee_photo: { type: GraphQLString },
        created_at: { type: GraphQLString }
    })
});

// JWT Token
const generateToken = (user) => {
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        login: {
            type: GraphQLString,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(_, args) {
                const user = await User.findOne({ email: args.email });
                if (!user) throw new Error(ERROR.USER_NOT_FOUND);

                const isMatch = await bcrypt.compare(args.password, user.password);
                if (!isMatch) throw new Error(ERROR.INVALID_PASSWORD);

                return generateToken(user);
            }
        },
        getEmployees: {
            type: new GraphQLList(EmployeeType),
            async resolve(_, __, context) {
                if (!context.user) throw new Error(ERROR.UNAUTHORIZED);
                return await Employee.find();
            }
        },
        searchEmployee: {
            type: EmployeeType,
            args: { id: { type: GraphQLID } },
            async resolve(_, args, context) {
                if (!context.user) throw new Error(ERROR.UNAUTHORIZED);
                return await Employee.findById(args.id);
            }
        },
        searchEmployeeByDesignationOrDept: {
            type: new GraphQLList(EmployeeType),
            args: { designation: { type: GraphQLString }, department: { type: GraphQLString } },
            async resolve(_, args, context) {
                if (!context.user) throw new Error(ERROR.UNAUTHORIZED);
                return await Employee.find({
                    $or: [{ designation: args.designation }, { department: args.department }]
                });
            }
        }
    }
});

// Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: GraphQLString,
            args: {
                username: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(_, args) {
                const existingUser = await User.findOne({ email: args.email });
                if (existingUser) throw new Error(ERROR.EMAIL_EXISTS);

                const hashedPassword = await bcrypt.hash(args.password, 10);

                const newUser = new User({
                    username: args.username,
                    email: args.email,
                    password: hashedPassword
                });

                await newUser.save();
                return generateToken(newUser);
            }
        },
        addEmployee: {
            type: EmployeeType,
            args: {
              first_name: { type: new GraphQLNonNull(GraphQLString) },
              last_name: { type: new GraphQLNonNull(GraphQLString) },
              email: { type: new GraphQLNonNull(GraphQLString) },
              gender: { type: new GraphQLNonNull(GraphQLString) },
              designation: { type: new GraphQLNonNull(GraphQLString) },
              salary: { type: new GraphQLNonNull(GraphQLFloat) },
              date_of_joining: { type: new GraphQLNonNull(GraphQLString) },
              department: { type: new GraphQLNonNull(GraphQLString) },
              employee_photo: { type: GraphQLString }
            },
            async resolve(parent, args, context) {
              if (!context.user) throw new Error("Unauthorized access. Token required.");
              const newEmployee = new Employee({ ...args });
              return await newEmployee.save();
            }
        },         
        updateEmployee: {
            type: EmployeeType,
            args: {
                id: { type: GraphQLID },
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                email: { type: GraphQLString },
                gender: { type: GraphQLString },
                designation: { type: GraphQLString },
                salary: { type: GraphQLFloat },
                date_of_joining: { type: GraphQLString },
                department: { type: GraphQLString },
                employee_photo: { type: GraphQLString }
            },
            async resolve(_, args, context) {
                if (!context.user) throw new Error(ERROR.UNAUTHORIZED);
                args.updated_at = new Date().toISOString();
                return await Employee.findByIdAndUpdate(args.id, args, { new: true });
            }
        },
        deleteEmployee: {
            type: EmployeeType,
            args: { id: { type: GraphQLID } },
            async resolve(_, args, context) {
                if (!context.user) throw new Error(ERROR.UNAUTHORIZED);
                return await Employee.findByIdAndDelete(args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
