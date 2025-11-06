from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

# 🔹 Página inicial redireciona para login
@app.route('/')
def index():
    return redirect(url_for('login'))

# 🔹 Página de login
@app.route('/login')
def login():
    return render_template('login.html')

# 🔹 Página de cadastro
@app.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')
