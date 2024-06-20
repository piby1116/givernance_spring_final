document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('.mainContent section');
    const connectButton = document.getElementById('connectWallet');
    const walletAddressDisplay = document.getElementById('walletAddressDisplay');
    const nicknameInput = document.getElementById('nicknameInput');
    const updateNicknameButton = document.getElementById('updateNickname');
    const uploadProfileImage = document.getElementById('profilePicUpload');
    const profileImage = document.getElementById('profilePicPreview');

    // Load nickname from local storage
    const savedNickname = localStorage.getItem('nickname');
    if (savedNickname) {
        nicknameInput.value = savedNickname;
    }

    updateNicknameButton.addEventListener('click', function() {
        const nickname = nicknameInput.value;
        localStorage.setItem('nickname', nickname);
        alert('Nickname updated!');
    });

    function uploadProfilePicture(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
                profileImage.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    async function connectWallet() {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                walletAddressDisplay.textContent = `Connected: ${address}`;
            } catch (error) {
                console.error('Failed to connect to MetaMask:', error);
                alert('Failed to connect MetaMask. Please make sure it is installed and you are logged in.');
            }
        } else {
            alert('Please install MetaMask to use this feature.');
        }
    }

    connectButton.addEventListener('click', connectWallet);
    uploadProfileImage.addEventListener('change', uploadProfilePicture);

    menuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            sections.forEach(section => section.style.display = 'none');
            const activeSection = document.getElementById(item.id.replace('Menu', 'Section'));
            if (activeSection) {
                activeSection.style.display = 'block';
            }
        });
    });

    // Show the first section by default
    if (sections.length > 0) {
        sections[0].style.display = 'block';
    }
});
