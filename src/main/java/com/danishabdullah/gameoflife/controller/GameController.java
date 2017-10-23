package com.danishabdullah.gameoflife.controller;

import com.danishabdullah.gameoflife.model.Game;
import com.danishabdullah.gameoflife.service.GameService;
import com.danishabdullah.gameoflife.service.IGameService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@EnableAutoConfiguration
public class GameController {
    @Autowired
    private IGameService gameService;

    private static final Logger logger = LoggerFactory.getLogger(GameController.class);

    @RequestMapping(value = "/save", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    public Map<String, String> saveGame(@RequestParam(value = "worldX", required = true) int worldX,
                                        @RequestParam(value = "worldY", required = true) int worldY,
                                        @RequestParam(value = "aliveCells", required = true) String aliveCells) {
        logger.info("Api request received");
        Map<String, String> response = new HashMap<String, String>();
        if ((worldX < 0) || (worldX > 600)) {
            response.put("status", "fail because of bad worldX value");
            return response;
        }
        if ((worldY < 0) || (worldY > 288)) {
            response.put("status", "fail because of bad worldY value");
            return response;
        }
        if (aliveCells.length() <= 0) {
            response.put("status", "fail because of no alive cells in request");
            return response;
        }
        try {
            String temp = String.valueOf(worldX) + "," + String.valueOf(worldY) + ";" + aliveCells;
            int id = temp.hashCode();
            Game game = new Game(id, worldX, worldY, aliveCells);
            gameService.create(game);
            response.put("id", String.valueOf(id));
        } catch (Exception e) {
            logger.error("Error occurred while trying to process api request", e);
            response.put("status", "fail");
        }

        return response;
    }

    ;

    @RequestMapping("/games/{id}")
    public Game findGame(@PathVariable int id) {

        return gameService.findById(id);
    }

    ;

    @RequestMapping("/games")
    public List<Game> findGames() {

        return gameService.findAll();
    }
}
