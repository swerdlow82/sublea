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


## Credits & Acknowledgements

The system architecture and backend design follow established FastAPI and SQLAlchemy best practices.
Development planning incorporated external instructional resources and tooling for design validation and
workflow clarification, with all implementation decisions and code authored and integrated by the Sublea team.