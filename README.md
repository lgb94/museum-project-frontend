# **Museum Project - Front End**

![alt text](./assets/de-milo.png)

Hosted site link: https://bespoke-cheesecake-846a37.netlify.app/

*This is what the website should look like from this repository - all built from scratch using React.*

The website pulls its information from an API I set up for a back-end project, the repository for which can be found here: https://github.com/lgb94/museum-back-end

I also wrote a couple loose scripts to collect this data which might be of interest to you if you are checking out this project, find them here: https://github.com/lgb94/museum-project-data-collection

## INSTALL INSTRUCTIONS:

1. Clone and fork the repository
2. run 'npm install' to install the projects required dependencies
3. npm run dev to host the site locally.

## HOW TO USE THE SITE:

### Create an account

Enter an email, a username and a password - if the email/username is already in the system this will fail.

- Don't worry about info collection, this is really just for show (the email is not used for anything, nor is there any functionality to contact it, etc.)

- Alternatively use one of the accounts from the development data from the back-end to use an account thats already in the system - the file you'll want to look at for usernames is users.js.*
- Use the accounts for bigjimmyburrito or sarahsaurus.rex for accounts with exhibits, any of the others should be 'fresh' accounts.

**You might notice there is no objects.js file within this development data - this is because the dev data that was used to seed my database for production was the object records that I had gathered from the museum APIs. While this info is publicly available re-uploading this date seems... inappropriate - I don't know the legality of it but i'm not gonna risk anything so, that is why the dev data for objects is missing. All of the tests should run using test data anyway, so unless you wanted to host a copy of my API from that repo, this shouldn't be an issue, but thought i should mention it here in case you're assessing this project*

## Use the Nav Bar to explore different areas of the site:
    
### Objects Search 

Allows you to search through the database of 2000+ sculptures from the Ancient World (which i built), collated from the Metropolitan Museum of Art and Harvard Art Museums apis. Click an object to see its detailed info, as well as a link to its page from the museum they're housed in. 
    
    - Met API: https://metmuseum.github.io/
    
    - Harvard API: https://github.com/harvardartmuseums/api-docs?tab=readme-ov-file
    
### Browse Exhibits 

Allows you to view the most recently posted user created exhibits on the site - click an exhibit to go that exhibits page.
    
From that exhibit page you can click an object and move through the exhibits objects in a virtual walkthrough of that users exhibit

### My Exhibits 

Takes you to your exhibits page, where you'll see all the exhibits you've created, as well as an option to create a new exhibit. If you have no exhibits, you'll be directed to create one so you can start collating objects.
    
When you create an exhibit (providing a title (required) and a description (can be left blank)) you'll be directed back to the objects page where you can add an object to your exhibit by clicking on that objects page, then using the dropdown box that appears to add it to your exhibit.
    
With an object added to you exhibit, heading back to your exhibits page will show that object in your exhibit (the first object added appears as the exhibits thumbnail picture)
       
Going to that exhibits page allows you to remove that object from the exhibit if you want to.
            
You can also edit that exhibits title and description from this page
    
To delete an exhibit, you can do this from your exhibits page - just hover over the exhibit you want to delete and a prompt should appear for you to delete it - this action is irreversible.

## Have fun!

If you think this is impressive, please offer me a job at your place of work - would be really appreciated 

#### REQUIREMENTS

You'll need the latest version of node.js for this thing to run properly, at the time of this projects last update. At present (25/10/2024) this is:

Node.js v22.2.0

#### Nice one! x