from flask import Flask, request, render_template, jsonify
from flask_cors import cross_origin
import sklearn
import pickle
import pandas as pd
import os

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
model = pickle.load(open("model.pkl", "rb"))



@app.route("/")
@cross_origin()
def home():
    if os.path.exists('../frontend/build/index.html'):
        return app.send_static_file('index.html')
    return render_template("index.html")




@app.route("/predict", methods=["POST"])
@cross_origin()
def predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    try:
        # Journey Date
        journey_date = data["journey_date"]
        Journey_day = int(pd.to_datetime(journey_date).day)
        Journey_month = int(pd.to_datetime(journey_date).month)

        # Departure Time
        dep_time = data["dep_time"]
        Dep_hour = int(dep_time.split(":")[0])
        Dep_min = int(dep_time.split(":")[1])

        # Arrival Time
        arr_time = data["arr_time"]
        Arrival_hour = int(arr_time.split(":")[0])
        Arrival_min = int(arr_time.split(":")[1])

        # Duration
        duration = data["duration"]
        if ":" in duration:
            dur_hour = int(duration.split(":")[0])
            dur_min = int(duration.split(":")[1])
        else:
            dur_hour = 0
            dur_min = int(duration)

        # Total Stops
        Total_stops = int(data["stops"])

        # Airline
        airline = data['airline']
        airline_dict = {
            'Jet Airways': [1,0,0,0,0,0,0,0,0,0,0],
            'IndiGo': [0,1,0,0,0,0,0,0,0,0,0],
            'Air India': [0,0,1,0,0,0,0,0,0,0,0],
            'Multiple carriers': [0,0,0,1,0,0,0,0,0,0,0],
            'SpiceJet': [0,0,0,0,1,0,0,0,0,0,0],
            'Vistara': [0,0,0,0,0,1,0,0,0,0,0],
            'GoAir': [0,0,0,0,0,0,1,0,0,0,0],
            'Multiple carriers Premium economy': [0,0,0,0,0,0,0,1,0,0,0],
            'Jet Airways Business': [0,0,0,0,0,0,0,0,1,0,0],
            'Vistara Premium economy': [0,0,0,0,0,0,0,0,0,1,0],
            'Trujet': [0,0,0,0,0,0,0,0,0,0,1]
        }
        airline_encoded = airline_dict.get(airline, [0]*11)
        Jet_Airways, IndiGo, Air_India, Multiple_carriers, SpiceJet, Vistara, GoAir, Multiple_carriers_Premium_economy, Jet_Airways_Business, Vistara_Premium_economy, Trujet = airline_encoded

        # Source
        Source = data["source"]
        source_dict = {
            'Delhi': [1,0,0,0],
            'Kolkata': [0,1,0,0],
            'Mumbai': [0,0,1,0],
            'Chennai': [0,0,0,1]
        }
        s_Delhi, s_Kolkata, s_Mumbai, s_Chennai = source_dict.get(Source, [0]*4)

        # Destination
        Destination = data["destination"]
        dest_dict = {
            'Cochin': [1,0,0,0,0],
            'Delhi': [0,1,0,0,0],
            'New_Delhi': [0,0,1,0,0],
            'Hyderabad': [0,0,0,1,0],
            'Kolkata': [0,0,0,0,1]
        }
        d_Cochin, d_Delhi, d_New_Delhi, d_Hyderabad, d_Kolkata = dest_dict.get(Destination, [0]*5)

        prediction = model.predict([[
            Total_stops,
            Journey_day,
            Journey_month,
            Dep_hour,
            Dep_min,
            Arrival_hour,
            Arrival_min,
            dur_hour,
            dur_min,
            Air_India,
            GoAir,
            IndiGo,
            Jet_Airways,
            Jet_Airways_Business,
            Multiple_carriers,
            Multiple_carriers_Premium_economy,
            SpiceJet,
            Trujet,
            Vistara,
            Vistara_Premium_economy,
            s_Chennai,
            s_Delhi,
            s_Kolkata,
            s_Mumbai,
            d_Cochin,
            d_Delhi,
            d_Hyderabad,
            d_Kolkata,
            d_New_Delhi
        ]])

        output = round(prediction[0], 2)
        return jsonify({"prediction": output})

    except Exception as e:
        return jsonify({"error": str(e)}), 400




if __name__ == "__main__":
    app.run(debug=True)
