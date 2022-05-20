# Callaba Engine Test Manager
<h2>How to setup</h2>

<h3>Credentials</h3>
Get the credentials in your AWS account.<br>
Then in <code>~</code> for Mac/Linux or in <code>C:\Users\<USER_NAME></code> for Windows<br>
Create a folder <code>.aws</code> and a file <code>credentials</code> in it.<br>
Write your credentials in the file this way: 
<pre>
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
</pre>

<h3>Security Group</h3>

Then create a Security Group in AWS Console with those parameters: 
<ul>
    <li>Name</li>
    <li>Description</li>
    <li>Inbound Rules:
        <ul>
            <li><b>Type</b> — All TCP, <b>Source</b> — Anywhere IPv4 </li>
            <li><b>Type</b> — All UPD, <b>Source</b> — Anywhere IPv4</li>
        </ul>
    </li>
    <li>Outbound rules
        <ul>
            <li><b>Type</b> — All Traffic, <b>Source</b> — Custom</li>
        </ul>
    </li>
</ul>

Save the security group id to paste it in your <code>server/index.js</code> file like this
<pre>const SECURITY_GROUP = "sg-0d17b51c3a3f8fab7"; // REPLACE WITH YOUR SECURITY GROUP ID</pre>

<h3>Key Pair</h3>
Then create a key pair in your AWS Console.<br>
Save the key pair name and paste it in the <code>server/index.js</code> under the security group id like this
<pre>const KEY_PAIR_NAME = "us-test"; // REPLACE WITH YOUR KEY PAIR NAME</pre>
<h3>Region</h3>
In the same <code>server/index.js</code> file under the key pair paste the region that is active in your AWS Console so it looks like this
<pre>const REGION = "us-east-1"; // REPLACE WITH YOUR REGION</pre>

<h2>How to run</h2>
<h3>Server</h3>
Open <code>server</code> folder in terminal and run
<pre>npm i</pre>
<pre>node index.js</pre>

You will get something like this as a response

<pre>Your AMI creation date is - 5/3/2022

Server listening on 3001</pre>

<h3>Client</h3>
In the second terminal window open <code>client</code> folder and run

<pre>npm i</pre>
<pre>npm start</pre>

The web page will be automatically opened in your browser

<h2>Tutorial</h2>
You can find a more detailed tutorial <a href='https://callabacloud.medium.com/creating-a-test-app-to-manage-callaba-engine-on-aws-using-a-restful-api-90947a3feb08'>here</a>.