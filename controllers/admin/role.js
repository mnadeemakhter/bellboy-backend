const RoleService = require('./../../services/role')
const ResponseService = require('../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

class RoleController {

    async addRole(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log('Role Data', messages.arrowHead, data)

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)
            if (!data.permissions || data.permissions.length == 0) throw new apiErrors.ValidationError('permissions', messages.PERMISSIONS_REQUIRED)

            let Role = await RoleService.getRole({ title: data.title });

            if (Role) throw new apiErrors.ResourceAlreadyExistError('Role', messages.RESOURCE_ALREADY_EXISTS)
            let dep;
            dep = data;
            dep.permissions = data.permissions.split(",").map(function (element) { return element; });

            let newRole = await RoleService.addRole(dep);

            return res.status(200).send(ResponseService.success({ Role: newRole }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getRoles(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo)
            let perPage = parseInt(req.query.perPage)
            let search = req.query.search || ''

            let data = Object.assign({}, req.query);
            let filters = { title: new RegExp(search, 'i'), };

            let total = await RoleService.RoleTotalCount( filters)

            let Roles = await RoleService.getRoles(filters, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ Roles, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async getRole(req, res) {
        try {

            let data = Object.assign({}, req.params);
            if (!data.role) throw new apiErrors.ValidationError('role', messages.ROLE_ID_REQUIRED)


            let role = await RoleService.getRole({_id:data.role})
            if (!role) throw new apiErrors.ResourceNotFoundError('role');

            return res.status(200).send(ResponseService.success(role))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async updateRole(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data._id) throw new apiErrors.ValidationError('_id', messages.ID_VALIDATION)
            if (data.permissions ) {
               
                data.permissions = data.permissions.split(",").map(function (element) { return element; });
            }
         
            let role = await RoleService.getRole({ _id: data._id });

            if (!role) throw new apiErrors.ResourceNotFoundError('role')
       

            role = await RoleService.updateRole({_id:data._id},data);

            return res.status(200).send(ResponseService.success({ role: role }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
}

module.exports = new RoleController();