import express from "express";


const app  = express()

const PORT = process.env.PORT || 3004

const main = async () => {
  

   

    try {
        console.log('Database connection established');

        // 2. Middleware
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // 3. Routes
        //app.use('/api/deliverables', deliverableRoutes);
        //app.use('/api/submissions', submissionRoutes);
        // app.use('/api/rules', rulesRoutes);

        // 4. Cron job to check for similarity on deadline
      

        // 5. Lancement serveur
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }
    catch (error) {
        console.error('Error establishing database connection:', error);
        process.exit(1);
    }  
}

main()
.catch((err) => {
    console.error('Error starting the server:', err);
    process.exit(1);
}
)