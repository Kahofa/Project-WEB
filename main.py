from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'your_secret_key'
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)


class Idea(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(150), nullable=False)
    idea_text = db.Column(db.Text, nullable=False)


with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return redirect(url_for("home"))

@app.route('/home')
def home():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    all_ideas = Idea.query.all()
    return render_template('index.html', ideas=all_ideas)


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if User.query.filter_by(username=username).first():
            flash('Пользователь с таким именем уже существует')
            return redirect(url_for('signup'))

        hashed_password = generate_password_hash(password, method='sha256')
        new_user = User(username=username, password=hashed_password)

        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        session['username'] = new_user.username
        return redirect(url_for('home'))

    return render_template('signup.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['username'] = user.username
            flash('Вы успешно вошли в систему!')
            return redirect(url_for('home'))
        else:
            flash('Неверное имя пользователя или пароль')

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))


@app.route('/add_idea', methods=['POST'])
def add_idea():
    if 'username' not in session:
        return jsonify({'error': 'User not logged in'}), 403

    data = request.get_json()
    idea_text = data.get('idea_text')

    if not idea_text:
        return jsonify({'error': 'No idea text provided'}), 400

    new_idea = Idea(username=session['username'], idea_text=idea_text)
    db.session.add(new_idea)
    db.session.commit()

    return jsonify({'message': 'Idea added successfully', 'idea_id': new_idea.id})


@app.route('/delete_idea/<int:id>', methods=['POST'])
def delete_idea(id):
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 403

    idea = Idea.query.get(id)
    if idea and idea.username == session['username']:
        db.session.delete(idea)
        db.session.commit()
        return jsonify({'message': 'Idea deleted successfully'}), 200
    else:
        return jsonify({'error': 'Idea not found or unauthorized'}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5252)
