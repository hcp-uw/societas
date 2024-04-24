import Husky from "../assets/HuskyRating.png";
import Husky2 from "../assets/HuskyGreeting.png";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Ratings {
    // rate projects
  const [firstModalOpen, setFirstModalOpen] = useState(false);
  const [secondModalOpen, setSecondModalOpen] = useState(false);

  const handleOpenFirstModal = () => {
    setFirstModalOpen(true);
  };

  const handleCloseFirstModal = () => {
    setFirstModalOpen(false);
  };

  const handleOpenSecondModal = () => {
    setFirstModalOpen(false);
    setSecondModalOpen(true);
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const feedbacks = formData.get("feedbacks") as string;
    const rating = Object.fromEntries(formData);
    if (!user) {
      return;
    }
    // ratingMutation.mutate({
    //   userId: user.id,
    //   projectId: projectId ?? "",
    //   feedback: feedbacks,
    //   rating: parseInt(rating as string),
    // })

    console.log("Feedbacks:", feedbacks);
    console.log(rating);
    console.log(user?.firstName, user?.lastName);
    console.log(user);
    console.log(projectId);

    handleCloseFirstModal();
    handleOpenSecondModal();
  };


  /////////////////


    return (
        
        <div>
                  <button className="text-zinc-100 h-fit py-1 px-6 rounded-lg bg-blue-500 font-medium hover:bg-blue-300 transition-colors" onClick={handleOpenFirstModal}>
                      Rate Project
                  </button>

                  {firstModalOpen ? (
                    <form
                      className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
                      onSubmit={(e) => handleSubmit(e)}
                    >
                      <div className="bg-white p-8 rounded shadow-lg w-1/2">
                        <h1 className="text-center RTPO-title" style={{ fontSize: "37px" }}>
                          Rate Your Experience:
                          {/* Project Owner: Flying Walrus{" "} */}
                        </h1>
                        <h1
                          className="text-center RTPO-subTitle"
                          style={{ fontSize: "20px" }}
                        >
                          5000 Pieces Puzzle BuildingFlying Walrus
                        </h1>

                        <div className="RTPO-wrapper">
                          <div className="col-7">
                            {/* stars */}
                            <div className="starContainer">
                              <div className="container__items">
                                <input type="radio" name="stars" id="st5" value={5} />
                                <label htmlFor="st5">
                                  <div className="star-stroke shadow ">
                                    <div className="star-fill"></div>
                                  </div>
                                  <div
                                    className="label-description"
                                    data-content="Excellent"
                                  ></div>
                                </label>


                                <input type="radio" name="stars" id="st4" value={4} />
                                <label htmlFor="st4">
                                  <div className="star-stroke shadow ">
                                    <div className="star-fill"></div>
                                  </div>
                                  <div
                                    className="label-description"
                                    data-content="Good"
                                  ></div>
                                </label>


                                <input type="radio" name="stars" id="st3" value={3} />
                                <label htmlFor="st3">
                                  <div className="star-stroke shadow ">
                                    <div className="star-fill"></div>
                                  </div>
                                  <div
                                    className="label-description"
                                    data-content="OK"
                                  ></div>
                                </label>


                                <input type="radio" name="stars" id="st2" value={2} />
                                <label htmlFor="st2">
                                  <div className="star-stroke shadow ">
                                    <div className="star-fill"></div>
                                  </div>
                                  <div
                                    className="label-description"
                                    data-content="Bad"
                                  ></div>
                                </label>


                                <input type="radio" name="stars" id="st1" value={1} />
                                <label htmlFor="st1">
                                  <div className="star-stroke shadow ">
                                    <div className="star-fill"></div>
                                  </div>
                                  <div
                                    className="label-description"
                                    data-content="Terrible"
                                  ></div>
                                </label>
                              </div>
                            </div>

                            <div className="RTPO-input-div">
                              <input
                                type="text"
                                name="feedbacks"
                                className="RTPO-form-control"
                                aria-describedby="tagsHelpInline"
                                placeholder="Have feedbacks? Share it here!"
                              />
                              <div className="RTPO-input-notes">
                                <p>
                                  Note: Your feedback will be anonymouse and only visible to
                                  the project owner!{" "}
                                </p>
                              </div>
                            </div>

                            <div
                              className="RTPO-button-wrapper"
                              style={{ padding: "6% 15% 10% 15%" }}
                            >
                              <button
                                type="submit"
                                className="PP-button RTPO-button-orange"
                              >
                                Submit
                              </button>
                              <button
                                type="button"
                                id="closeModal"
                                className="PP-button RTPO-button-red"
                                onClick={handleCloseFirstModal}
                              >
                                Maybe Later
                              </button>
                            </div>
                          </div>
                          <div className="Hysky-Img-Wrapper">
                            <div className="speech-bubble RTPO-speech-bubble-text">
                              <span>
                                How many stars would you like to give to
                                <span className="RTPO-name"> {""}Flying Walrus?</span>
                              </span>
                            </div>
                            <img
                              src={Husky}
                              alt="Husky Greeting!"
                              className="huskyRatingImg"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div></div>
                  )}

                  {secondModalOpen ? (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                      <div className="bg-white p-8 rounded shadow-lg w-1/2">
                        <img src={Husky2} alt="Husky Woof!" className="image-center" />
                        <h1 className="text-center RC-title" style={{ fontSize: "45px" }}>
                          Woof!
                        </h1>


                        <div
                          className="text-center RC-text"
                          style={{ marginTop: "2rem", fontSize: "22px" }}
                        >
                          <p style={{ marginBottom: "0" }}>
                            You have successfully submitted the rating for
                            <span style={{ fontWeight: "bolder", fontSize: "23px" }}>
                              {" "}
                              Flying Walrus
                            </span>
                            !! Thank you!!
                          </p>
                        </div>


                        <div className="RC-button-wrapper">
                          <NavLink to="/account" className="RC-button-confirmation">
                            <button type="button" className="PP-button RC-button-orange">
                              Back To Profile
                            </button>
                          </NavLink>


                          <NavLink to="/" className="RC-button-confirmation">
                            <button type="button" className="PP-button RC-button-orange">
                              Back To Home Page
                            </button>
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
    )
}