function uploadHandler(event) {
    const data = new FormData();
    data.append('file', event.target.files[0]);

    axios.post('/upload', data)
      .then((res) => {
        this.setState({ photos: [res.data, ...this.state.photos] });
      });
  }