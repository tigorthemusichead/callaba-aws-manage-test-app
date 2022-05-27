import express from "express";
import {
    EC2Client,
    DescribeInstancesCommand,
    DescribeImagesCommand,
    CreateTagsCommand,
    RunInstancesCommand,
    StopInstancesCommand,
    StartInstancesCommand
} from "@aws-sdk/client-ec2";


// SETUP!!!
const SECURITY_GROUP = "sg-008815d0e5188f905"; // REPLACE WITH YOUR SECURITY GROUP ID
const KEY_PAIR_NAME = "instance-test"; // REPLACE WITH YOUR KEY PAIR NAME
const REGION = "us-east-1"; // REPLACE WITH YOUR REGION
const ec2Client = new EC2Client({ region: REGION });

// Function that describes all the instances of your AWS account
// Function returns an object
const describeInstance = async () => {
    let data;
    try {
        data = await ec2Client.send(new DescribeInstancesCommand({}));
    } catch (err) {
        console.log("Error", err);
    }
    return data;
};

// Function that describes AMI
const describeAMI = async () => {
    const params = {
        Filters: [
            {
                Name: 'product-code',
                Values: [
                    'e4db8sityo6vmgym1ewplwmzj'
                ]
            },
        ]
    };
    const data = await ec2Client.send(new DescribeImagesCommand(params));
    data.Images.forEach(image => {
        if(new Date(image.CreationDate) > new Date(data.Images[0].CreationDate))
            data.Images[0] = image;
    });
    console.log(`\nYour AMI creation date is - ${new Date(data.Images[0].CreationDate).toLocaleDateString()}\n`);
    return(data.Images[0].ImageId);
}

// Function that creates a new instance
// Function createInstance requires the instance's name and AMI ID (image ID)
// Function returns the created instance's ID
async function createInstance(name, imageId){
    let instanceId;
    const instanceParams = {
        ImageId: imageId,
        InstanceType: "c4.2xlarge", // CHOOSE FROM c4.2xlarge, c4.4xlarge, c4.8xlarge, c5.4xlarge, c5.9xlarge, c5.12xlarge and c5.18xlarge
        KeyName: KEY_PAIR_NAME,
        SecurityGroupIds: [SECURITY_GROUP],
        MinCount: 1,
        MaxCount: 1,
    };
    try {
        // Creating instance
        const data = await ec2Client.send(new RunInstancesCommand(instanceParams));
        instanceId = data.Instances[0].InstanceId;
        // Adding tags to the created instance
        const tagParams = {
            Resources: [instanceId],
            Tags: [
                {
                    Key: "Name",
                    Value: name,
                },
            ],
        };
        try {
            // Tagging the created instance
            const data = await ec2Client.send(new CreateTagsCommand(tagParams));
        } catch (err) {
            console.log("Error", err);
        }
    } catch (err) {
        console.log("Error", err);
    }
    return instanceId;
}

// Function that stops an instance
// Function requires an object "params", which has to contain "instanceIDs" array
const stopInstance = async (params) => {
    try {
        return await ec2Client.send(new StopInstancesCommand(params));
    } catch (err) {
        console.log("Error", err);
    }
};

// Function that starts an instance
// Function requires an object "params", which has to contain "instanceIDs" array
const startInstance = async (params) => {
    try {
        return await ec2Client.send(new StartInstancesCommand(params));
    } catch (err) {
        console.log("Error2", err);
    }
};

// Server setup

const PORT = process.env.PORT || 3001;
const app = express();

// Requests handlers

// Object to pass to stopInstance and startInstance functions
let params = {InstanceIds: [], amiID: await describeAMI()}

app.get("/start", (req, res) =>{
    startInstance(params)
        .then(() => res.json({message: "Instance is started"}));
});

app.get("/stop", (req, res) => {
    stopInstance(params)
        .then(() => res.json({message: "Instance is stopped"}));
});

app.get("/create", async (req, res) =>{
    // REPLACE "Test-Instance" WITH ANY NAME YOU WANT
    params.InstanceIds[0] = await createInstance("Test-Instance", params.amiID);
    res.json({message: "Instance is created", instanceId: params.InstanceIds[0]});
})

app.get("/describe", async (req, res) => {
    res.json(await describeInstance());
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

