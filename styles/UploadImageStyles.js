import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginTop: 50, // Pushes it down below the logout button
    marginBottom: 20, // Space before image container
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderContainer: {
    width: 300,
    height: 300,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
   
    borderRadius: 10,
    width: '48%',
    marginHorizontal:10,
    alignItems: 'center',
  },
  predictButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal:10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resultContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  resultText: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
  },
  logoutContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10, // Ensures it stays on top
  },
  
  logoutButton: {
    backgroundColor: '#D32F2F', // Red color
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  
  logoutText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures proper spacing between heading & logout button
    alignItems: 'center',
    marginBottom: 20, // Adds spacing below the header
  },
  
});

export default styles;