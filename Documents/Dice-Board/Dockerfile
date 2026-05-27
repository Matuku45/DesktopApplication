# Use official Python image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy all files
COPY . /app

# Upgrade pip and install dependencies
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir flask flask-socketio eventlet

# Expose port for Render
EXPOSE 8000

# Command to run the app with Socket.IO (eventlet)
CMD ["python", "app.py"]
