document.addEventListener('DOMContentLoaded', function() {
    const getStartedButton = document.querySelector('.cta-button');
    
    getStartedButton.addEventListener('click', function() {
        // Add your action here
        console.log('Get Started button clicked!');
        
        // Example actions (uncomment what you need):
        window.location.href = '/budget.html';
        // window.open('https://example.com', '_blank');
        // showModal();
        //alert('Welcome! Let\'s get started with your savings journey.');
    });
});
