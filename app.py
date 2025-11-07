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
    
# 🔹 Página de projetos (rendenização principal)
@app.route('/projetos/<int:id_usuario>')
def projetos(id_usuario):
    return render_template('projetos.html', id_usuario=id_usuario)
<<<<<<< HEAD
=======


if __name__ == "__main__":
    print("🚀 Servidor Flask rodando em modo DEBUG...")
    app.run(debug=True)
>>>>>>> 27d8aaa (arrumei o projetos)
