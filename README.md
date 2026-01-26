# sublea
A platform for students to post and find subleases.


VENV Installation:
# Navigate to your backend folder
cd sublea
cd backend

## If terminal prompt shows (base) its recommended to deactivate conda to avoid conflicts
conda deactivate

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# You should see (venv) in your terminal now

# Verify activation
which python3
# Expected output: backend/venv/bin/python3

# Install all requirements
pip install -r requirements.txt

# Verify installation
pip list