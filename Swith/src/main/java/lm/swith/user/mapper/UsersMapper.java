package lm.swith.user.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import lm.swith.user.model.SwithUser;

@Mapper
public interface UsersMapper {
    void insertUser(SwithUser swithUser);
    
    SwithUser findUserRole(String role);
    
    List<SwithUser> findUsersAll();
    
    SwithUser findByEmail(String email);

    SwithUser findByEmailAndPassword(String email, String password);
    
    // SwithUserMapper를 가져오는 메서드 추가
    SwithUserMapper getSwithUserMapper();
    
    interface SwithUserMapper {
        void updateUserIntroduction(SwithUser user);
    }
}
