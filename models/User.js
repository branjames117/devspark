const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// Create User model to extend Model also authenticate password
class User extends Model {
    // Set method to run per user to check password
    checkPassword(loginPw){
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// define User table and configurations
User.init(
    {
        // Table column definitions
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // set min length of password
                len: [4]
            }
        },
        bio: {
            type: DataTypes.STRING,
            
        },
       
        // bday: {
        //     type: DataTypes.DATEONLY(),
        //     allowNull: false,
        //     set (valueToBeSet) {
        //         this.setDataValue('date', bdayHandler)
        //     }
        // },
        techskills: {
            type: DataTypes.STRING,
            
        },
        github: {
            type: DataTypes.STRING,
            
        }

    },
    {
        hooks: {
            // set up before create hook functionality 
            async beforeCreate(newUserData){
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // Set up beforeUpdate hook functionality 
            async beforeUpdate(updatedUserData){
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData; 
            }
        },

        sequelize,
        // Dont auto create created_at/ updated_at timestamps
        timestamps: false,
        freezeTableName: true,
        modelName: 'user'

    }
);

module.exports = User;