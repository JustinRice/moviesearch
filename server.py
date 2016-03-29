import os, uuid
from flask.ext.socketio import SocketIO, emit
from flask_socketio import join_room, leave_room
from flask import Flask, session, render_template
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider

auth_provider = PlainTextAuthProvider(
    username = 'cassandra', password='cassandra')
    

app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app)

results = []
            
users = {}
testUsers = []

@socketio.on('connect', namespace='/moviesearch')
def makeConnection():
    session['uuid']=uuid.uuid1()
    print('connected')

    
@app.route('/')
def mainIndex():
    primaryresults = []
    secondaryresults = []
    rentype = 0
    return render_template('index.html', rentype = rentype, primaryresults = primaryresults, secondaryresults = secondaryresults)
    
@socketio.on('search', namespace='/moviesearch')
def search(searchTerm): 
    cluster = Cluster(auth_provider=auth_provider)
    thissearch = cluster.connect('movie')
    query = "select * from movie where title= '" + searchTerm + "'"
    rows = thissearch.execute(query)
    answer = []
    for row in rows:
        answer.append(row)
    primaryresults = []
    for row in answer:
        primaryresults.append(str(row.title))
        primaryresults.append(str(row.director))
        primaryresults.append(str(row.score))
        primaryresults.append(str(row.votes))
        primaryresults.append(str(row.yr))
    query = "select actor from actor where movie= '" + searchTerm + "'"
    rows = thissearch.execute(query)
    for row in rows:
        primaryresults.append(str(row.actor))
    emit('movieRes',primaryresults)

@socketio.on('getCredits', namespace='/moviesearch')
def getCredits(actorname):
    cluster = Cluster(auth_provider=auth_provider)
    thissearch = cluster.connect('movie')
    query = "select movie from actor where actor = '" + actorname + "'"
    rows = thissearch.execute(query)
    answer = []
    answer.append(str(actorname))
    for row in rows:
        answer.append(str(row.movie))
    emit('addCred',answer)
    
# start the server
if __name__ == '__main__':
        socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port =int(os.getenv('PORT', 8080)), debug=True)
