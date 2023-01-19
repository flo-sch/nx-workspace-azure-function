echo "example script - not much happening at the moment"

# Very basic deployment script just to illustrate the example
# The deployment would eventually be done in an automated CD pipeline

# 1- Create a service principal to use from the CLI
# Read more about SP: https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli
# export AZURE_SERVICE_PRINCIPAL_NAME="azure-function-nx-deployer"
# az ad sp create-for-rbac --name $AZURE_SERVICE_PRINCIPAL_NAME

# Then fill-in the required parameters
# export AZURE_FUNCTION_APP_NAME="azure-function-nx"
# export AZURE_FUNCTION_APP_OS="linux"
# export AZURE_REGION="northeurope"
# export AZURE_RESOURCE_GROUP_NAME="azure-function-nx-rg"
# export AZURE_SERVICE_PRINCIPAL_TENANT="XXX"
# export AZURE_SERVICE_PRINCIPAL_APP_ID="YYY"
# export AZURE_SERVICE_PRINCIPAL_PASSWORD="ZZZ"
# export AZURE_STORAGE_NAME="nxazurefunction123456"

# 2- Login with the service principal credentials and create the required resources for the function app
# Read more about Azure resources: https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?tabs=azure-cli%2Cbrowser#create-supporting-azure-resources-for-your-function
# az login --service-principal --username $AZURE_SERVICE_PRINCIPAL_APP_ID --password $AZURE_SERVICE_PRINCIPAL_PASSWORD --tenant $AZURE_SERVICE_PRINCIPAL_TENANT
# az group create --name $AZURE_RESOURCE_GROUP_NAME --location $AZURE_REGION
# az storage account create --name $AZURE_STORAGE_NAME --location $AZURE_REGION --sku Standard_LRS --resource-group $AZURE_RESOURCE_GROUP_NAME
# az functionapp create --consumption-plan-location $AZURE_REGION --os-type $AZURE_FUNCTION_APP_OS --runtime node --runtime-version 14 --functions-version 3 --name $AZURE_FUNCTION_APP_NAME --storage-account $AZURE_STORAGE_NAME --resource-group $AZURE_RESOURCE_GROUP_NAME

# 3- Deploy the app
# Read more about Azure Function Core Tools: https://docs.microsoft.com/en-us/azure/azure-functions/functions-core-tools-reference?tabs=v2#func-azure-functionapp-publish
# yarn nx run-many --all --target build --production
# func azure functionapp publish $AZURE_FUNCTION_APP_NAME --typescript

# 4- To teardown the project, delete the entire resource group
# az group delete --name $AZURE_RESOURCE_GROUP_NAME
