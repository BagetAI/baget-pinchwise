document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('waitlist-form');
    const counterDisplay = document.getElementById('signup-count');
    const dbId = document.body.dataset.dbId;

    // Fetch current count
    async function updateCount() {
        if (!dbId) return;
        try {
            const response = await fetch(`https://app.baget.ai/api/public/databases/${dbId}/count`);
            const data = await response.json();
            if (data.count !== undefined) {
                counterDisplay.innerText = data.count + 124; // Baseline social proof
            }
        } catch (err) {
            console.error('Error fetching count:', err);
        }
    }

    updateCount();

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const submitBtn = form.querySelector('button');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = 'Joining...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`https://app.baget.ai/api/public/databases/${dbId}/rows`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: {
                            email: email,
                            source: 'landing_page',
                            timestamp: new Date().toISOString()
                        }
                    })
                });

                if (response.ok) {
                    form.innerHTML = '<p style="font-size: 24px; font-family: var(--font-heading); color: var(--accent-gold);">Welcome to the inner circle. We will reach out when the first drop is ready.</p>';
                    updateCount();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (err) {
                alert('Something went wrong. Please try again.');
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
