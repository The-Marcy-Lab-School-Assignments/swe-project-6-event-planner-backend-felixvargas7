**1. What did you ask the AI to help you with, and why did you choose to use AI for that specific task?**

> _I want you to generate me seed data based on the current sections I have in my seed file, and that follows these schema designs I have listed _

I used AI to generate my seed data information regarding event creations for each user. I chose this ask in specific because I wanted to improve my workflow by focused on tasks that required more logic thinking in each phase. Seeding felt like filling in data that wasn't aligning with my workflow so I decided to use AI to create that data for me.

**2. How did you evaluate whether the AI's output was correct or useful before using it?**

AI's output did give me a list of seed data that I could directly plug into my `seed.js` file, however it had two requisites I had to check for. There were clear constraints regarding what type of data could be accepted specifically for `event_type`. I needed to make sure the given data was in accordance to said constraints so I had to go line by line while having my schema design present to ensure each event data that was created had followed the restrictions.

The second requisite was the event insertions, where the AI had given me two sets, one using `eventQuery` and one using `eventQueryReturning`. I also had to review what the consequences of having these two sets would have when working with the database.

**3. How did what the AI produced differ from what you ultimately used, and what does that tell you about your own understanding of the problem?**

After careful consideration of both requisites I had placed on for reviewing the code the AI had presented me with, I understood that I had to delete one of the event insertions. I noted that the `eventQuery` did not have `RETURNING` which is essential to get the event IDs to seed the RSVPs. Keeping both `eventQuery` and `eventQueryReturning` would result in duplicate data, so it was imperative I delete one to ensure functionality of my application.

**4. What did you learn from using AI in this way?**

The mean takeaway I had from using AI for this specific situation was that the response data it gives you when prompting for seed data always needs revision, especially when a project has specific restrictions in place, or if a potential bug in the code could cause issues later on. Both of which were the case for me, as I wanted to really make sure the `event_type` was following the proper instructions set in the README so as to not have points taken away for preventable outliers, and I also had the removing of a event insertion function to prevent the bug of having duplicate data, a consequence that could cause ripple effects in my code as I get into more phases and testing.
